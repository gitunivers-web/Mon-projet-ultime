import { WebTemplate, PhoneNumber, Transfer, CoinTransaction, Website, PurchasedPhone } from "@workspace/api-client-react/src/generated/api.schemas";

export const MOCK_TEMPLATES: WebTemplate[] = [
  { id: "tpl-1", name: "Apex Business", category: "Business", description: "Modern, high-converting landing page for SaaS and B2B.", previewImage: "template-business.png", coinCost: 50, tags: ["SaaS", "Corporate", "Clean"], featured: true },
  { id: "tpl-2", name: "Nova Folio", category: "Portfolio", description: "Showcase your creative work with bold typography and dark mode.", previewImage: "template-portfolio.png", coinCost: 40, tags: ["Creative", "Dark", "Minimal"], featured: true },
  { id: "tpl-3", name: "Luxe Commerce", category: "E-commerce", description: "Premium storefront design for fashion and luxury goods.", previewImage: "template-ecommerce.png", coinCost: 60, tags: ["Shop", "Luxury", "Modern"], featured: false },
  { id: "tpl-4", name: "Byte Blog", category: "Blog", description: "Reader-focused layout perfect for tech and news publications.", previewImage: "template-portfolio.png", coinCost: 35, tags: ["Content", "Reading", "Fast"], featured: false },
];

export const MOCK_PHONES: PhoneNumber[] = [
  { id: "ph-1", number: "+33 6 12 34 56 78", country: "France", countryCode: "FR", services: ["WhatsApp", "Telegram", "SMS"], coinCost: 30, durationDays: 30 },
  { id: "ph-2", number: "+1 202 555 0123", country: "USA", countryCode: "US", services: ["WhatsApp", "Instagram", "TikTok"], coinCost: 40, durationDays: 30 },
  { id: "ph-3", number: "+44 7700 900077", country: "UK", countryCode: "GB", services: ["Telegram", "SMS"], coinCost: 25, durationDays: 30 },
  { id: "ph-4", number: "+49 151 23456789", country: "Germany", countryCode: "DE", services: ["WhatsApp", "Telegram"], coinCost: 35, durationDays: 30 },
  { id: "ph-5", number: "+225 07 00 00 00 00", country: "Ivory Coast", countryCode: "CI", services: ["WhatsApp", "Telegram", "SMS"], coinCost: 20, durationDays: 30 },
];

export const MOCK_MY_WEBSITES: Website[] = [
  {
    id: "ws-1",
    siteName: "My Tech Startup",
    templateId: "tpl-1",
    templateName: "Apex Business",
    url: "https://mytechstartup.digitpro.site",
    status: "active",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "ws-2",
    siteName: "Personal Portfolio",
    templateId: "tpl-2",
    templateName: "Nova Folio",
    url: "https://personal-portfolio.digitpro.site",
    status: "active",
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
];

export const MOCK_MY_PHONES: PurchasedPhone[] = [
  {
    id: "mph-1",
    number: "+33 6 12 34 56 78",
    country: "France",
    service: "WhatsApp",
    expiresAt: new Date(Date.now() + 86400000 * 25).toISOString(),
    smsCode: "492011",
    status: "active",
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
];

// Mock transfers — using bank-format tracking URLs
export const MOCK_TRANSFERS: (Transfer & { bankKey?: string; bankName?: string })[] = [
  {
    id: "tr-1",
    type: "simulation",
    trackingCode: "r4t7m2nz1k3b",
    trackingUrl: "https://securer4t7m2nz1k3b.novabank.com",
    senderName: "Acme Corp",
    senderBank: "Chase Bank",
    senderIban: "US12 3456 7890 1234 5678 90",
    receiverName: "John Doe",
    receiverBank: "Bank of America",
    receiverIban: "US98 7654 3210 9876 5432 10",
    amount: 4500.00,
    currency: "USD",
    reference: "TRF2024001",
    description: "Paiement facture N°2024-001",
    status: "processing",
    progress: 65,
    transferDate: new Date(Date.now() - 86400000).toISOString().split("T")[0],
    estimatedArrival: new Date(Date.now() + 2 * 86400000).toISOString().split("T")[0],
    coinCost: 30,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    bankKey: "novabank",
    bankName: "Novabank",
  },
  {
    id: "tr-2",
    type: "document",
    trackingCode: "DOC-11294-X",
    trackingUrl: "",
    senderName: "Global Trade Ltd",
    senderBank: "HSBC",
    senderIban: "GB29 NWBK 6016 1331 9268 19",
    receiverName: "Jane Smith",
    receiverBank: "Barclays",
    receiverIban: "GB82 WEST 1234 5698 7654 32",
    amount: 12500.00,
    currency: "EUR",
    reference: "PAY3210987654",
    description: "Remboursement contrat 2024",
    status: "completed",
    progress: 100,
    transferDate: new Date(Date.now() - 86400000 * 3).toISOString().split("T")[0],
    estimatedArrival: new Date(Date.now() - 86400000).toISOString().split("T")[0],
    coinCost: 20,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    bankKey: "neobank",
    bankName: "Neobank",
  },
];

export const MOCK_TRANSACTIONS: CoinTransaction[] = [
  { id: "ctx-1", type: "debit", amount: 30, description: "Numéro virtuel +33 6 12 34 56 78 — WhatsApp", service: "Phones", createdAt: new Date(Date.now() - 86400000 * 5).toISOString() },
  { id: "ctx-2", type: "credit", amount: 150, description: "Recharge via Crypto (Oxapay) — Pack 150 coins", service: "Billing", createdAt: new Date(Date.now() - 86400000 * 6).toISOString() },
  { id: "ctx-3", type: "debit", amount: 50, description: "Création site 'My Tech Startup' — Apex Business", service: "Websites", createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: "ctx-4", type: "debit", amount: 30, description: "Simulation virement — Acme Corp → John Doe (USD 4,500)", service: "Transfers", createdAt: new Date(Date.now() - 86400000).toISOString() },
];
