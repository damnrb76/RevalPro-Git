import { users, type User, type InsertUser } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

// Define the session store type
const MemoryStore = createMemoryStore(session);

// Extend the interface with any CRUD methods and session store
export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  currentId: number;
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.currentId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // 24 hours - prune expired entries
    });
    
    // Add demo user for testing with simple hashing
    this.users.set(1, {
      id: 1, 
      username: "demouser",
      password: "hashed_hello", // Simple hash for "hello"
      created: new Date()
    });
    this.currentId = 2; // Start new users at ID 2
  }

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
    const timestamp = new Date();
    const user: User = { 
      ...insertUser, 
      id,
      created: timestamp
    };
    this.users.set(id, user);
    return user;
  }
}

export const storage = new MemStorage();
