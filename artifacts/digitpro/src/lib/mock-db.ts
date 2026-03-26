import { WebTemplate, PhoneNumber, Transfer, CoinTransaction, Website, PurchasedPhone } from "@workspace/api-client-react/src/generated/api.schemas";

// Realistic mock data to provide an immediate high-quality interactive experience
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
  { id: "ws-1", siteName: "My Tech Startup", templateId: "tpl-1", templateName: "Apex Business", url: "https://mytechstartup.digitpro.site", status: "active", createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: "ws-2", siteName: "Personal Portfolio", templateId: "tpl-2", templateName: "Nova Folio", url: "https://portfolio.digitpro.site", status: "pending", createdAt: new Date(Date.now() - 3600000 * 5).toISOString() },
];

export const MOCK_MY_PHONES: PurchasedPhone[] = [
  { id: "mph-1", number: "+33 6 12 34 56 78", country: "France", service: "WhatsApp", expiresAt: new Date(Date.now() + 86400000 * 25).toISOString(), smsCode: "492011", status: "active", createdAt: new Date(Date.now() - 86400000 * 5).toISOString() },
];

export const MOCK_TRANSFERS: Transfer[] = [
  { id: "tr-1", type: "simulation", trackingCode: "TRX-89201-B", trackingUrl: "https://digitpro.app/track/TRX-89201-B", senderName: "Acme Corp", senderBank: "Chase Bank", receiverName: "John Doe", receiverBank: "Bank of America", amount: 4500.00, currency: "USD", status: "processing", progress: 65, coinCost: 30, createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: "tr-2", type: "document", trackingCode: "DOC-11294-X", trackingUrl: "", senderName: "Global Trade Ltd", senderBank: "HSBC", receiverName: "Jane Smith", receiverBank: "Barclays", amount: 12500.00, currency: "EUR", status: "completed", progress: 100, coinCost: 20, createdAt: new Date(Date.now() - 86400000 * 3).toISOString() },
];

export const MOCK_TRANSACTIONS: CoinTransaction[] = [
  { id: "ctx-1", type: "debit", amount: 30, description: "Purchased Virtual Phone Number (+33)", service: "Phones", createdAt: new Date(Date.now() - 86400000 * 5).toISOString() },
  { id: "ctx-2", type: "credit", amount: 150, description: "Top-up via Crypto (Oxapay)", service: "Billing", createdAt: new Date(Date.now() - 86400000 * 6).toISOString() },
  { id: "ctx-3", type: "debit", amount: 50, description: "Created Website 'My Tech Startup'", service: "Websites", createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
];
