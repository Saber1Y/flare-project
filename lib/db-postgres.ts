import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.POSTGRES_URL;

if (!connectionString) {
  throw new Error('POSTGRES_URL not configured. Please add POSTGRES_URL environment variable in Vercel dashboard after deployment.');
}

const client = postgres(connectionString);
export const db = drizzle(client, { schema });

// Auto-migrate tables on first connection
export async function runMigrations() {
  try {
    await migrate(db, { migrationsFolder: './migrations' });
    console.log('✅ Database migrations completed');
  } catch (error) {
    console.warn('⚠️ Migration failed, creating tables manually...');
    
    // Create tables manually if migration fails
    await client`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        hash TEXT UNIQUE NOT NULL,
        from_address TEXT NOT NULL,
        to_address TEXT,
        value TEXT NOT NULL,
        block_number INTEGER NOT NULL,
        timestamp INTEGER NOT NULL,
        gas_used TEXT,
        gas_price TEXT,
        category TEXT DEFAULT 'uncategorized',
        recorded BOOLEAN DEFAULT false,
        proof_id TEXT,
        network TEXT DEFAULT 'coston2',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS proofs (
        id SERIAL PRIMARY KEY,
        tx_hash TEXT NOT NULL,
        receipt_id TEXT NOT NULL,
        iso_type TEXT DEFAULT 'payment',
        record_hash TEXT,
        anchor_tx_hash TEXT,
        status TEXT DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE INDEX IF NOT EXISTS idx_from_address ON transactions(from_address);
      CREATE INDEX IF NOT EXISTS idx_to_address ON transactions(to_address);
      CREATE INDEX IF NOT EXISTS idx_hash ON transactions(hash);
      CREATE INDEX IF NOT EXISTS idx_category ON transactions(category);
    `;
    
    console.log('✅ Tables created manually');
  }
}

// Export schema tables for convenience
export const { transactions, proofs } = schema;

// For TypeScript types
export type Database = typeof db;