import { pgTable, text, serial, integer, timestamp, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const transfersTable = pgTable("transfers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: text("type", { enum: ["simulation", "document"] }).notNull(),
  trackingCode: text("tracking_code").notNull().unique(),
  senderName: text("sender_name").notNull(),
  senderIban: text("sender_iban"),
  senderBank: text("sender_bank").notNull(),
  receiverName: text("receiver_name").notNull(),
  receiverIban: text("receiver_iban"),
  receiverBank: text("receiver_bank").notNull(),
  amount: doublePrecision("amount").notNull(),
  currency: text("currency").notNull().default("EUR"),
  reference: text("reference"),
  description: text("description"),
  status: text("status", { enum: ["initiated", "processing", "completed", "failed"] }).notNull().default("initiated"),
  progress: integer("progress").notNull().default(0),
  transferDate: text("transfer_date"),
  estimatedArrival: text("estimated_arrival"),
  coinCost: integer("coin_cost").notNull().default(30),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTransferSchema = createInsertSchema(transfersTable).omit({ id: true, createdAt: true });
export type InsertTransfer = z.infer<typeof insertTransferSchema>;
export type Transfer = typeof transfersTable.$inferSelect;
