import { pgTable, text, serial, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const websitesTable = pgTable("websites", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  siteName: text("site_name").notNull(),
  templateId: text("template_id").notNull(),
  templateName: text("template_name").notNull(),
  url: text("url").notNull(),
  logoUrl: text("logo_url"),
  tagline: text("tagline"),
  primaryColor: text("primary_color"),
  customizations: jsonb("customizations"),
  status: text("status", { enum: ["active", "inactive", "pending"] }).notNull().default("active"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertWebsiteSchema = createInsertSchema(websitesTable).omit({ id: true, createdAt: true });
export type InsertWebsite = z.infer<typeof insertWebsiteSchema>;
export type Website = typeof websitesTable.$inferSelect;
