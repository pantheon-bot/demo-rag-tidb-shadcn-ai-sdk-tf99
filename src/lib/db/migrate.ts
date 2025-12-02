import { promises as fs } from 'fs';
import { join } from 'path';
import db from './db';
import { sql } from 'kysely';

/**
 * Execute SQL migration files
 * Reads .sql files from migrations directory and executes them
 */
export async function runMigrations() {
  const migrationsDir = join(process.cwd(), 'src/lib/db/migrations');

  try {
    const files = await fs.readdir(migrationsDir);
    const sqlFiles = files.filter(f => f.endsWith('.sql')).sort();

    for (const file of sqlFiles) {
      console.log(`Running migration: ${file}`);
      const filePath = join(migrationsDir, file);
      const sqlContent = await fs.readFile(filePath, 'utf-8');

      // Split by semicolon to handle multiple statements
      const statements = sqlContent
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));

      for (const statement of statements) {
        await sql.raw(statement).execute(db);
      }

      console.log(`✓ Completed migration: ${file}`);
    }

    console.log('All migrations completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}

// Run migrations if this file is executed directly
if (require.main === module) {
  runMigrations()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
