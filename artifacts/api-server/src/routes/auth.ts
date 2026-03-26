import { Router, type IRouter } from "express";
import { db, usersTable, coinTransactionsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { hashPassword, verifyPassword, generateToken } from "../lib/auth.js";
import { authenticate, type AuthRequest } from "../middlewares/authenticate.js";
import { RegisterBody, LoginBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/auth/register", async (req, res) => {
  const parsed = RegisterBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "BadRequest", message: parsed.error.message });
    return;
  }

  const { email, password, firstName, lastName } = parsed.data;

  const existing = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
  if (existing.length) {
    res.status(400).json({ error: "EmailTaken", message: "This email is already registered" });
    return;
  }

  const passwordHash = hashPassword(password);
  const [user] = await db.insert(usersTable).values({
    email,
    passwordHash,
    firstName,
    lastName,
    coinBalance: 100,
  }).returning();

  await db.insert(coinTransactionsTable).values({
    userId: user.id,
    type: "credit",
    amount: 100,
    description: "Welcome bonus — 100 coins offerts",
    service: "welcome",
  });

  const token = generateToken(user.id);
  res.status(201).json({
    user: {
      id: String(user.id),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      coinBalance: user.coinBalance,
      createdAt: user.createdAt.toISOString(),
    },
    token,
  });
});

router.post("/auth/login", async (req, res) => {
  const parsed = LoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "BadRequest", message: parsed.error.message });
    return;
  }

  const { email, password } = parsed.data;
  const users = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
  if (!users.length || !verifyPassword(password, users[0].passwordHash)) {
    res.status(401).json({ error: "Unauthorized", message: "Email ou mot de passe incorrect" });
    return;
  }

  const user = users[0];
  const token = generateToken(user.id);
  res.json({
    user: {
      id: String(user.id),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      coinBalance: user.coinBalance,
      createdAt: user.createdAt.toISOString(),
    },
    token,
  });
});

router.post("/auth/logout", (_req, res) => {
  res.json({ success: true, message: "Logged out" });
});

router.get("/auth/me", authenticate, async (req: AuthRequest, res) => {
  const user = req.user!;
  res.json({
    id: String(user.id),
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    coinBalance: user.coinBalance,
    createdAt: user.createdAt.toISOString(),
  });
});

export default router;
