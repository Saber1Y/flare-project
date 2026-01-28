import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.POSTGRES_URL!;

if (!connectionString) {
  throw new Error('POSTGRES_URL environment variable is not set');
}

// Add connection timeout and retry logic
const client = postgres(connectionString, {
  connect_timeout: 30,
  idle_timeout: 20,
  max_lifetime: 60 * 30, // 30 minutes
});

export const db = drizzle(client, { schema });