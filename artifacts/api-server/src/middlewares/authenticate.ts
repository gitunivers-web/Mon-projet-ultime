import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../lib/auth.js";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

export interface AuthRequest extends Request {
  userId?: number;
  user?: typeof usersTable.$inferSelect;
}

export async function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized", message: "Missing token" });
    return;
  }

  const token = authHeader.substring(7);
  const payload = verifyToken(token);
  if (!payload) {
    res.status(401).json({ error: "Unauthorized", message: "Invalid or expired token" });
    return;
  }

  const users = await db.select().from(usersTable).where(eq(usersTable.id, payload.userId)).limit(1);
  if (!users.length) {
    res.status(401).json({ error: "Unauthorized", message: "User not found" });
    return;
  }

  req.userId = payload.userId;
  req.user = users[0];
  next();
}
