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
      return res.status(400).json({ error: "Contract content is required" });
    }

    try {
      const analysis = await storage.analyzeContract(content);
      res.json(analysis);
    } catch (error) {
      console.error('Analysis error:', error);
      res.status(500).json({ 
        error: (error as Error).message || "Failed to analyze contract" 
      });
    }
  });

  // Contract Generation
  app.post("/api/contracts/generate", async (req, res) => {
    const { type, partyA, partyB, terms } = req.body;

    if (!type || !partyA || !partyB) {
      return res.status(400).json({ 
        error: "Contract type and party names are required" 
      });
    }

    try {
      const contract = await storage.generateContract({
        type,
        partyA,
        partyB,
        terms: terms || '',
        userId: req.user?.id
      });
      res.json(contract);
    } catch (error) {
      console.error('Generation error:', error);
      res.status(500).json({ 
        error: (error as Error).message || "Failed to generate contract" 
      });
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
      console.error('Chat error:', error);
      res.status(500).json({ 
        error: (error as Error).message || "Failed to process message" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}