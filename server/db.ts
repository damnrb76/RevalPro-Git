import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  console.warn("DATABASE_URL is missing. Database features will not work.");
}

// Export a dummy pool/db if DATABASE_URL is missing to prevent crash on import
// But actual queries will fail
export const pool = process.env.DATABASE_URL 
  ? new Pool({ connectionString: process.env.DATABASE_URL })
  : new Pool({ connectionString: "postgres://dummy:dummy@localhost:5432/dummy" }); // Dummy connection string

export const db = drizzle({ client: pool, schema });
