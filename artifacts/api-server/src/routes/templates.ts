import { Router, type IRouter } from "express";
import { db, usersTable, websitesTable, coinTransactionsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { authenticate, type AuthRequest } from "../middlewares/authenticate.js";
import { CreateWebsiteBody } from "@workspace/api-zod";

const router: IRouter = Router();

const TEMPLATES = [
  {
    id: "tpl-business-1",
    name: "Corporate Pro",
    category: "Business",
    description: "Template professionnel pour entreprises et sociétés avec pages services et équipe",
    previewImage: "/images/template-business.png",
    coinCost: 50,
    tags: ["business", "corporate", "professionnel"],
    featured: true,
  },
  {
    id: "tpl-ecom-1",
    name: "ShopEasy",
    category: "E-commerce",
    description: "Boutique en ligne complète avec catalogue produits, panier et paiement",
    previewImage: "/images/template-ecommerce.png",
    coinCost: 60,
    tags: ["ecommerce", "boutique", "vente"],
    featured: true,
  },
  {
    id: "tpl-portfolio-1",
    name: "Creative Portfolio",
    category: "Portfolio",
    description: "Portfolio élégant pour créatifs, photographes, designers et artistes",
    previewImage: "/images/template-portfolio.png",
    coinCost: 40,
    tags: ["portfolio", "créatif", "design"],
    featured: false,
  },
  {
    id: "tpl-restaurant-1",
    name: "RestaurantX",
    category: "Restaurant",
    description: "Site restaurant avec menu en ligne, réservations et galerie photos",
    previewImage: "/images/template-business.png",
    coinCost: 50,
    tags: ["restaurant", "menu", "réservation"],
    featured: false,
  },
  {
    id: "tpl-agency-1",
    name: "Agency Hub",
    category: "Agence",
    description: "Site agence digitale avec portfolio projets, équipe et formulaire devis",
    previewImage: "/images/template-ecommerce.png",
    coinCost: 55,
    tags: ["agence", "marketing", "digital"],
    featured: true,
  },
  {
    id: "tpl-blog-1",
    name: "BlogMaster",
    category: "Blog",
    description: "Blog moderne avec système de catégories, tags et newsletter",
    previewImage: "/images/template-portfolio.png",
    coinCost: 35,
    tags: ["blog", "articles", "contenu"],
    featured: false,
  },
];

router.get("/templates", (req, res) => {
  const { category } = req.query;
  let templates = TEMPLATES;
  if (category && typeof category === "string") {
    templates = TEMPLATES.filter(t => t.category.toLowerCase() === category.toLowerCase());
  }
  res.json(templates);
});

router.get("/templates/:id", (req, res) => {
  const template = TEMPLATES.find(t => t.id === req.params.id);
  if (!template) {
    res.status(404).json({ error: "NotFound", message: "Template not found" });
    return;
  }
  res.json(template);
});

router.post("/templates/create", authenticate, async (req: AuthRequest, res) => {
  const parsed = CreateWebsiteBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "BadRequest", message: parsed.error.message });
    return;
  }

  const { templateId, siteName, tagline, logoUrl, primaryColor, customizations } = parsed.data;
  const template = TEMPLATES.find(t => t.id === templateId);
  if (!template) {
    res.status(404).json({ error: "NotFound", message: "Template not found" });
    return;
  }

  const user = req.user!;
  if (user.coinBalance < template.coinCost) {
    res.status(402).json({ error: "InsufficientCoins", message: `Solde insuffisant. Ce template coûte ${template.coinCost} coins.` });
    return;
  }

  await db.update(usersTable)
    .set({ coinBalance: user.coinBalance - template.coinCost })
    .where(eq(usersTable.id, user.id));

  await db.insert(coinTransactionsTable).values({
    userId: user.id,
    type: "debit",
    amount: template.coinCost,
    description: `Création de site: ${siteName} (${template.name})`,
    service: "website-builder",
  });

  const slug = siteName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  const url = `https://${slug}.digitpro.site`;

  const [website] = await db.insert(websitesTable).values({
    userId: user.id,
    siteName,
    templateId,
    templateName: template.name,
    url,
    logoUrl: logoUrl ?? null,
    tagline: tagline ?? null,
    primaryColor: primaryColor ?? null,
    customizations: customizations ?? null,
    status: "active",
  }).returning();

  res.status(201).json({
    id: String(website.id),
    siteName: website.siteName,
    templateId: website.templateId,
    templateName: website.templateName,
    url: website.url,
    status: website.status,
    createdAt: website.createdAt.toISOString(),
  });
});

router.get("/websites", authenticate, async (req: AuthRequest, res) => {
  const sites = await db.select().from(websitesTable)
    .where(eq(websitesTable.userId, req.userId!))
    .orderBy(desc(websitesTable.createdAt));

  res.json(sites.map(s => ({
    id: String(s.id),
    siteName: s.siteName,
    templateId: s.templateId,
    templateName: s.templateName,
    url: s.url,
    status: s.status,
    createdAt: s.createdAt.toISOString(),
  })));
});

export default router;
