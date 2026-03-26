import { Router, type IRouter } from "express";
import { db, usersTable, transfersTable, coinTransactionsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { authenticate, type AuthRequest } from "../middlewares/authenticate.js";
import { CreateTransferBody } from "@workspace/api-zod";
import { generateTrackingCode } from "../lib/auth.js";

const router: IRouter = Router();

const COIN_COST_SIMULATION = 30;
const COIN_COST_DOCUMENT = 20;

function getTransferUrl(trackingCode: string): string {
  const domain = process.env.REPLIT_DOMAINS?.split(",")[0] || "localhost";
  return `https://${domain}/track/${trackingCode}`;
}

function getTransferSteps(status: string, progress: number) {
  const steps = [
    { label: "Ordre reçu", description: "Votre ordre de virement a été enregistré", completed: progress >= 10 },
    { label: "Vérification", description: "Vérification des données et conformité bancaire", completed: progress >= 35 },
    { label: "En transit", description: "Fonds en cours de transfert vers la banque destinataire", completed: progress >= 70 },
    { label: "Livré", description: "Virement crédité sur le compte destinataire", completed: progress >= 100 },
  ];
  return steps;
}

router.get("/transfers", authenticate, async (req: AuthRequest, res) => {
  const transfers = await db.select().from(transfersTable)
    .where(eq(transfersTable.userId, req.userId!))
    .orderBy(desc(transfersTable.createdAt));

  res.json(transfers.map(t => ({
    id: String(t.id),
    type: t.type,
    trackingCode: t.trackingCode,
    trackingUrl: getTransferUrl(t.trackingCode),
    senderName: t.senderName,
    senderIban: t.senderIban,
    senderBank: t.senderBank,
    receiverName: t.receiverName,
    receiverIban: t.receiverIban,
    receiverBank: t.receiverBank,
    amount: t.amount,
    currency: t.currency,
    reference: t.reference,
    description: t.description,
    status: t.status,
    progress: t.progress,
    transferDate: t.transferDate,
    estimatedArrival: t.estimatedArrival,
    coinCost: t.coinCost,
    createdAt: t.createdAt.toISOString(),
  })));
});

router.post("/transfers", authenticate, async (req: AuthRequest, res) => {
  const parsed = CreateTransferBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "BadRequest", message: parsed.error.message });
    return;
  }

  const data = parsed.data;
  const coinCost = data.type === "document" ? COIN_COST_DOCUMENT : COIN_COST_SIMULATION;
  const user = req.user!;

  if (user.coinBalance < coinCost) {
    res.status(402).json({ error: "InsufficientCoins", message: `Solde insuffisant. Ce service coûte ${coinCost} coins.` });
    return;
  }

  await db.update(usersTable)
    .set({ coinBalance: user.coinBalance - coinCost })
    .where(eq(usersTable.id, user.id));

  const serviceLabel = data.type === "document" ? "Ordre de virement (PDF)" : "Simulation de virement";
  await db.insert(coinTransactionsTable).values({
    userId: user.id,
    type: "debit",
    amount: coinCost,
    description: `${serviceLabel} — ${data.amount} ${data.currency} → ${data.receiverName}`,
    service: "transfer",
  });

  const trackingCode = generateTrackingCode();
  const today = new Date();
  const arrival = new Date(today);
  arrival.setDate(arrival.getDate() + 3);

  const [transfer] = await db.insert(transfersTable).values({
    userId: user.id,
    type: data.type,
    trackingCode,
    senderName: data.senderName,
    senderIban: data.senderIban ?? null,
    senderBank: data.senderBank,
    receiverName: data.receiverName,
    receiverIban: data.receiverIban ?? null,
    receiverBank: data.receiverBank,
    amount: data.amount,
    currency: data.currency,
    reference: data.reference ?? `REF-${Date.now()}`,
    description: data.description ?? null,
    status: "processing",
    progress: 35,
    transferDate: data.transferDate ?? today.toISOString().split("T")[0],
    estimatedArrival: data.estimatedArrival ?? arrival.toISOString().split("T")[0],
    coinCost,
  }).returning();

  res.status(201).json({
    id: String(transfer.id),
    type: transfer.type,
    trackingCode: transfer.trackingCode,
    trackingUrl: getTransferUrl(transfer.trackingCode),
    senderName: transfer.senderName,
    senderIban: transfer.senderIban,
    senderBank: transfer.senderBank,
    receiverName: transfer.receiverName,
    receiverIban: transfer.receiverIban,
    receiverBank: transfer.receiverBank,
    amount: transfer.amount,
    currency: transfer.currency,
    reference: transfer.reference,
    description: transfer.description,
    status: transfer.status,
    progress: transfer.progress,
    transferDate: transfer.transferDate,
    estimatedArrival: transfer.estimatedArrival,
    coinCost: transfer.coinCost,
    createdAt: transfer.createdAt.toISOString(),
  });
});

router.get("/transfers/track/:trackingCode", async (req, res) => {
  const { trackingCode } = req.params;
  const transfers = await db.select().from(transfersTable)
    .where(eq(transfersTable.trackingCode, trackingCode))
    .limit(1);

  if (!transfers.length) {
    res.status(404).json({ error: "NotFound", message: "Aucun virement trouvé avec ce code" });
    return;
  }

  const t = transfers[0];
  res.json({
    trackingCode: t.trackingCode,
    senderName: t.senderName,
    senderBank: t.senderBank,
    receiverName: t.receiverName,
    receiverBank: t.receiverBank,
    amount: t.amount,
    currency: t.currency,
    status: t.status,
    progress: t.progress,
    transferDate: t.transferDate,
    estimatedArrival: t.estimatedArrival,
    steps: getTransferSteps(t.status, t.progress),
  });
});

router.get("/transfers/:id", authenticate, async (req: AuthRequest, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "BadRequest", message: "Invalid ID" });
    return;
  }

  const transfers = await db.select().from(transfersTable)
    .where(eq(transfersTable.id, id))
    .limit(1);

  if (!transfers.length || transfers[0].userId !== req.userId) {
    res.status(404).json({ error: "NotFound", message: "Virement non trouvé" });
    return;
  }

  const t = transfers[0];
  res.json({
    id: String(t.id),
    type: t.type,
    trackingCode: t.trackingCode,
    trackingUrl: getTransferUrl(t.trackingCode),
    senderName: t.senderName,
    senderIban: t.senderIban,
    senderBank: t.senderBank,
    receiverName: t.receiverName,
    receiverIban: t.receiverIban,
    receiverBank: t.receiverBank,
    amount: t.amount,
    currency: t.currency,
    reference: t.reference,
    description: t.description,
    status: t.status,
    progress: t.progress,
    transferDate: t.transferDate,
    estimatedArrival: t.estimatedArrival,
    coinCost: t.coinCost,
    createdAt: t.createdAt.toISOString(),
  });
});

router.get("/transfers/:id/pdf", authenticate, async (req: AuthRequest, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "BadRequest", message: "Invalid ID" });
    return;
  }

  const transfers = await db.select().from(transfersTable)
    .where(eq(transfersTable.id, id))
    .limit(1);

  if (!transfers.length || transfers[0].userId !== req.userId) {
    res.status(404).json({ error: "NotFound", message: "Virement non trouvé" });
    return;
  }

  const t = transfers[0];

  const pdfContent = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj

2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj

3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792]
/Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj

4 0 obj
<< /Length 800 >>
stream
BT
/F1 24 Tf
50 740 Td
(ORDRE DE VIREMENT BANCAIRE) Tj
/F1 12 Tf
0 -40 Td
(Reference: ${t.reference ?? t.trackingCode}) Tj
0 -20 Td
(Date: ${t.transferDate ?? new Date().toLocaleDateString("fr-FR")}) Tj
0 -20 Td
(Arrivee estimee: ${t.estimatedArrival ?? "Sous 3 jours ouvrables"}) Tj
0 -40 Td
(DONNEUR D'ORDRE) Tj
/F1 11 Tf
0 -20 Td
(Nom: ${t.senderName}) Tj
0 -16 Td
(Banque: ${t.senderBank}) Tj
0 -16 Td
(IBAN: ${t.senderIban ?? "Confidentiel"}) Tj
/F1 12 Tf
0 -35 Td
(BENEFICIAIRE) Tj
/F1 11 Tf
0 -20 Td
(Nom: ${t.receiverName}) Tj
0 -16 Td
(Banque: ${t.receiverBank}) Tj
0 -16 Td
(IBAN: ${t.receiverIban ?? "Confidentiel"}) Tj
/F1 14 Tf
0 -40 Td
(MONTANT: ${t.amount} ${t.currency}) Tj
/F1 10 Tf
0 -30 Td
(Motif: ${t.description ?? "Virement bancaire"}) Tj
0 -30 Td
(Statut: ${t.status === "processing" ? "En cours de traitement" : t.status}) Tj
0 -60 Td
(Code de suivi: ${t.trackingCode}) Tj
0 -20 Td
(Document genere par DigitPro Platform) Tj
ET
endstream
endobj

5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj

xref
0 6
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000266 00000 n
0000001118 00000 n

trailer
<< /Size 6 /Root 1 0 R >>
startxref
1200
%%EOF`;

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="virement-${t.trackingCode}.pdf"`);
  res.send(Buffer.from(pdfContent, "latin1"));
});

export default router;
