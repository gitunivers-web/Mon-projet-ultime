import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const purchasedPhonesTable = pgTable("purchased_phones", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  number: text("number").notNull(),
  country: text("country").notNull(),
  service: text("service").notNull(),
  smsCode: text("sms_code"),
  status: text("status", { enum: ["active", "expired", "used"] }).notNull().default("active"),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPurchasedPhoneSchema = createInsertSchema(purchasedPhonesTable).omit({ id: true, createdAt: true });
export type InsertPurchasedPhone = z.infer<typeof insertPurchasedPhoneSchema>;
export type PurchasedPhone = typeof purchasedPhonesTable.$inferSelect;
