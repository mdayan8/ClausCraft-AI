import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertContractSchema, insertChatMessageSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  // Contract Analysis
  app.post("/api/contracts/analyze", async (req, res) => {
    const { content } = req.body;
    if (!content) {
      return res.status(400).send("Contract content is required");
    }

    try {
      const analysis = await storage.analyzeContract(content);
      res.json(analysis);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // Contract Generation
  app.post("/api/contracts/generate", async (req, res) => {
    try {
      const contract = await storage.generateContract(req.body);
      res.json(contract);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // Chat
  app.get("/api/chat/history", async (req, res) => {
    if (!req.user) return res.sendStatus(401);
    const history = await storage.getChatHistory(req.user.id);
    res.json(history);
  });

  app.post("/api/chat/message", async (req, res) => {
    if (!req.user) return res.sendStatus(401);
    const parsedMessage = insertChatMessageSchema.safeParse(req.body);
    
    if (!parsedMessage.success) {
      return res.status(400).json({ error: "Invalid message format" });
    }

    try {
      const response = await storage.createChatMessage({
        userId: req.user.id,
        message: parsedMessage.data.message,
      });
      res.json(response);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
