import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.POSTGRES_URL;

if (!connectionString) {
  // For deployment without Postgres, we'll throw a helpful error
  throw new Error('POSTGRES_URL not configured. Please add POSTGRES_URL environment variable in Vercel dashboard after deployment.');
}

const client = postgres(connectionString);
export const db = drizzle(client, { schema });

// Export schema tables for convenience
export const { transactions, proofs } = schema;

// For TypeScript types
export type Database = typeof db;