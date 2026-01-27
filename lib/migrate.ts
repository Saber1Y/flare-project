import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import * as schema from './schema';

const migrationClient = postgres(process.env.POSTGRES_URL!, { max: 1 });
const migrationDb = drizzle(migrationClient, { schema });

async function runMigrations() {
  try {
    console.log('Running migrations...');
    await migrate(migrationDb, { migrationsFolder: './migrations' });
    console.log('Migrations completed!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigrations();