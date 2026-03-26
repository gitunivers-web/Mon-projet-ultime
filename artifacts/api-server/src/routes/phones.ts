import { Router, type IRouter } from "express";
import { db, usersTable, purchasedPhonesTable, coinTransactionsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { authenticate, type AuthRequest } from "../middlewares/authenticate.js";
import { PurchasePhoneBody } from "@workspace/api-zod";

const router: IRouter = Router();

const COIN_COST_PHONE = 30;

const AVAILABLE_PHONES = [
  { id: "ph-fr-1", number: "+33 6 12 34 56 78", country: "France", countryCode: "FR", services: ["WhatsApp", "Telegram", "SMS"], coinCost: COIN_COST_PHONE, durationDays: 7 },
  { id: "ph-fr-2", number: "+33 7 98 76 54 32", country: "France", countryCode: "FR", services: ["WhatsApp", "Instagram", "SMS"], coinCost: COIN_COST_PHONE, durationDays: 7 },
  { id: "ph-us-1", number: "+1 424 555 0192", country: "États-Unis", countryCode: "US", services: ["WhatsApp", "Telegram", "TikTok", "Instagram", "SMS"], coinCost: COIN_COST_PHONE, durationDays: 7 },
  { id: "ph-us-2", number: "+1 310 555 0847", country: "États-Unis", countryCode: "US", services: ["WhatsApp", "SMS"], coinCost: COIN_COST_PHONE, durationDays: 7 },
  { id: "ph-gb-1", number: "+44 7700 900123", country: "Royaume-Uni", countryCode: "GB", services: ["WhatsApp", "Telegram", "SMS"], coinCost: COIN_COST_PHONE, durationDays: 7 },
  { id: "ph-de-1", number: "+49 151 23456789", country: "Allemagne", countryCode: "DE", services: ["WhatsApp", "Telegram", "Instagram", "SMS"], coinCost: COIN_COST_PHONE, durationDays: 7 },
  { id: "ph-ca-1", number: "+1 613 555 0192", country: "Canada", countryCode: "CA", services: ["WhatsApp", "TikTok", "SMS"], coinCost: COIN_COST_PHONE, durationDays: 7 },
  { id: "ph-ci-1", number: "+225 07 12 34 56 78", country: "Côte d'Ivoire", countryCode: "CI", services: ["WhatsApp", "Telegram", "SMS"], coinCost: COIN_COST_PHONE, durationDays: 7 },
];

router.get("/phones/available", (req, res) => {
  const { service, country } = req.query;
  let phones = AVAILABLE_PHONES;
  if (service && typeof service === "string") {
    phones = phones.filter(p => p.services.some(s => s.toLowerCase() === service.toLowerCase()));
  }
  if (country && typeof country === "string") {
    phones = phones.filter(p => p.countryCode.toLowerCase() === country.toLowerCase());
  }
  res.json(phones);
});

router.post("/phones/purchase", authenticate, async (req: AuthRequest, res) => {
  const parsed = PurchasePhoneBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "BadRequest", message: parsed.error.message });
    return;
  }

  const { phoneId, service } = parsed.data;
  const phone = AVAILABLE_PHONES.find(p => p.id === phoneId);
  if (!phone) {
    res.status(404).json({ error: "NotFound", message: "Numéro non disponible" });
    return;
  }

  const user = req.user!;
  if (user.coinBalance < phone.coinCost) {
    res.status(402).json({ error: "InsufficientCoins", message: `Solde insuffisant. Ce numéro coûte ${phone.coinCost} coins.` });
    return;
  }

  await db.update(usersTable)
    .set({ coinBalance: user.coinBalance - phone.coinCost })
    .where(eq(usersTable.id, user.id));

  await db.insert(coinTransactionsTable).values({
    userId: user.id,
    type: "debit",
    amount: phone.coinCost,
    description: `Numéro ${phone.number} — ${service}`,
    service: "phone-numbers",
  });

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + phone.durationDays);

  const smsCode = Math.floor(100000 + Math.random() * 900000).toString();

  const [purchased] = await db.insert(purchasedPhonesTable).values({
    userId: user.id,
    number: phone.number,
    country: phone.country,
    service,
    smsCode,
    status: "active",
    expiresAt,
  }).returning();

  res.status(201).json({
    id: String(purchased.id),
    number: purchased.number,
    country: purchased.country,
    service: purchased.service,
    expiresAt: purchased.expiresAt.toISOString(),
    smsCode: purchased.smsCode,
    status: purchased.status,
    createdAt: purchased.createdAt.toISOString(),
  });
});

router.get("/phones/my", authenticate, async (req: AuthRequest, res) => {
  const phones = await db.select().from(purchasedPhonesTable)
    .where(eq(purchasedPhonesTable.userId, req.userId!))
    .orderBy(desc(purchasedPhonesTable.createdAt));

  res.json(phones.map(p => ({
    id: String(p.id),
    number: p.number,
    country: p.country,
    service: p.service,
    expiresAt: p.expiresAt.toISOString(),
    smsCode: p.smsCode,
    status: p.status,
    createdAt: p.createdAt.toISOString(),
  })));
});

export default router;
