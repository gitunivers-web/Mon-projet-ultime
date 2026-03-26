import { Router, type IRouter } from "express";
import { db, usersTable, coinTransactionsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { authenticate, type AuthRequest } from "../middlewares/authenticate.js";
import { TopupCoinsBody } from "@workspace/api-zod";

const router: IRouter = Router();

const COIN_PACKAGES = [
  { id: "pack-60", coins: 60, priceXOF: 10000, priceUSD: 16.5, popular: false, bonus: 0 },
  { id: "pack-150", coins: 150, priceXOF: 25000, priceUSD: 41, popular: true, bonus: 10 },
  { id: "pack-350", coins: 350, priceXOF: 50000, priceUSD: 82, popular: false, bonus: 30 },
  { id: "pack-750", coins: 750, priceXOF: 100000, priceUSD: 164, popular: false, bonus: 100 },
];

router.get("/coins/balance", authenticate, async (req: AuthRequest, res) => {
  const user = req.user!;
  res.json({ balance: user.coinBalance, currency: "COINS" });
});

router.get("/coins/packages", (_req, res) => {
  res.json(COIN_PACKAGES);
});

router.post("/coins/topup", authenticate, async (req: AuthRequest, res) => {
  const parsed = TopupCoinsBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "BadRequest", message: parsed.error.message });
    return;
  }

  const { packageId, paymentMethod } = parsed.data;
  const pkg = COIN_PACKAGES.find(p => p.id === packageId);
  if (!pkg) {
    res.status(400).json({ error: "NotFound", message: "Package not found" });
    return;
  }

  let paymentUrl = "";
  if (paymentMethod === "crypto") {
    paymentUrl = `https://oxapay.com/pay/digitpro-${packageId}-${Date.now()}`;
  } else if (paymentMethod === "mtn_momo") {
    paymentUrl = `https://payment.digitpro.app/mtn/${packageId}-${Date.now()}`;
  } else {
    paymentUrl = `https://payment.digitpro.app/moov/${packageId}-${Date.now()}`;
  }

  res.json({
    paymentUrl,
    orderId: `ORD-${Date.now()}`,
    amount: pkg.priceXOF,
    currency: "XOF",
  });
});

router.get("/coins/transactions", authenticate, async (req: AuthRequest, res) => {
  const transactions = await db.select().from(coinTransactionsTable)
    .where(eq(coinTransactionsTable.userId, req.userId!))
    .orderBy(desc(coinTransactionsTable.createdAt))
    .limit(50);

  res.json(transactions.map(t => ({
    id: String(t.id),
    type: t.type,
    amount: t.amount,
    description: t.description,
    service: t.service,
    createdAt: t.createdAt.toISOString(),
  })));
});

export { COIN_PACKAGES };
export default router;
