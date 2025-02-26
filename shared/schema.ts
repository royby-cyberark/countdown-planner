import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const countdown = pgTable("countdown", {
  id: serial("id").primaryKey(),
  targetTime: timestamp("target_time").notNull(),
});

export const items = pgTable("items", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  order: integer("order").notNull(),
});

export const agenda = pgTable("agenda", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  order: integer("order").notNull(),
  highlighted: boolean("highlighted").notNull().default(false),
});

// Update the countdown schema to handle string input
export const insertCountdownSchema = z.object({
  targetTime: z.string().transform((str) => new Date(str)),
});

export const insertItemSchema = createInsertSchema(items).pick({
  content: true,
  order: true,
});

export const insertAgendaSchema = createInsertSchema(agenda).pick({
  content: true,
  order: true,
  highlighted: true,
});

export type InsertCountdown = z.infer<typeof insertCountdownSchema>;
export type InsertItem = z.infer<typeof insertItemSchema>;
export type InsertAgenda = z.infer<typeof insertAgendaSchema>;

export type Countdown = typeof countdown.$inferSelect;
export type Item = typeof items.$inferSelect;
export type Agenda = typeof agenda.$inferSelect;