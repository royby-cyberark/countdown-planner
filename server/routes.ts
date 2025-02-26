import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCountdownSchema, insertItemSchema, insertAgendaSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Countdown routes
  app.get("/api/countdown", async (req, res) => {
    const countdown = await storage.getCountdown();
    res.json(countdown);
  });

  app.post("/api/countdown", async (req, res) => {
    const parsed = insertCountdownSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error });
    }
    const countdown = await storage.setCountdown(parsed.data);
    res.json(countdown);
  });

  // Items routes
  app.get("/api/items", async (req, res) => {
    const items = await storage.getItems();
    res.json(items);
  });

  app.post("/api/items", async (req, res) => {
    const parsed = insertItemSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error });
    }
    const item = await storage.createItem(parsed.data);
    res.json(item);
  });

  app.patch("/api/items/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const parsed = insertItemSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error });
    }
    const item = await storage.updateItem(id, parsed.data);
    res.json(item);
  });

  app.delete("/api/items/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.deleteItem(id);
    res.status(204).send();
  });

  // Agenda routes
  app.get("/api/agenda", async (req, res) => {
    const agenda = await storage.getAgenda();
    res.json(agenda);
  });

  app.post("/api/agenda", async (req, res) => {
    const parsed = insertAgendaSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error });
    }
    const agenda = await storage.createAgenda(parsed.data);
    res.json(agenda);
  });

  app.patch("/api/agenda/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const parsed = insertAgendaSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error });
    }
    const agenda = await storage.updateAgenda(id, parsed.data);
    res.json(agenda);
  });

  app.delete("/api/agenda/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.deleteAgenda(id);
    res.status(204).send();
  });

  const httpServer = createServer(app);
  return httpServer;
}
