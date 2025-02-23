import { users, type User, type InsertUser, type ChatMessage, type Contract } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // Auth methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Contract methods
  analyzeContract(content: string): Promise<any>;
  generateContract(data: any): Promise<Contract>;
  
  // Chat methods
  getChatHistory(userId: number): Promise<ChatMessage[]>;
  createChatMessage(data: { userId: number; message: string }): Promise<ChatMessage>;
  
  // Session store
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private chatMessages: Map<number, ChatMessage>;
  private contracts: Map<number, Contract>;
  public sessionStore: session.Store;
  private currentId: number;
  private currentChatId: number;
  private currentContractId: number;

  constructor() {
    this.users = new Map();
    this.chatMessages = new Map();
    this.contracts = new Map();
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
    this.currentId = 1;
    this.currentChatId = 1;
    this.currentContractId = 1;
  }

  // Auth methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Contract methods
  async analyzeContract(content: string) {
    // Simulated AI analysis
    return {
      summary: "Contract analysis summary would go here",
      risks: [
        { type: "high", description: "Identified risk 1" },
        { type: "medium", description: "Identified risk 2" }
      ],
      recommendations: ["Recommendation 1", "Recommendation 2"]
    };
  }

  async generateContract(data: any): Promise<Contract> {
    const id = this.currentContractId++;
    const contract = {
      id,
      userId: data.userId,
      title: data.type,
      content: `Generated contract content for ${data.type}`,
      analysis: null,
      version: 1,
      createdAt: new Date(),
    };
    this.contracts.set(id, contract);
    return contract;
  }

  // Chat methods
  async getChatHistory(userId: number): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .filter(msg => msg.userId === userId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async createChatMessage(data: { userId: number; message: string }): Promise<ChatMessage> {
    const id = this.currentChatId++;
    const message: ChatMessage = {
      id,
      userId: data.userId,
      message: data.message,
      response: "AI Assistant: This is a simulated response to your legal question.",
      createdAt: new Date(),
    };
    this.chatMessages.set(id, message);
    return message;
  }
}

export const storage = new MemStorage();
