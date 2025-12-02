import db from './db';
import { sql } from 'kysely';

/**
 * Setup database tables directly
 * This creates the tables if they don't exist
 */
export async function setupDatabase() {
  console.log('Setting up database tables...');

  try {
    // Create documents table with VECTOR type
    await sql`
      CREATE TABLE IF NOT EXISTS documents (
        id INT AUTO_INCREMENT PRIMARY KEY,
        content TEXT NOT NULL,
        embedding VECTOR(1536) NOT NULL,
        source VARCHAR(255),
        metadata JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `.execute(db);
    console.log('✓ Created documents table');

    // Try to create vector index (may fail if TiFlash is not set up)
    try {
      await sql`
        CREATE VECTOR INDEX idx_embedding ON documents ((VEC_COSINE_DISTANCE(embedding)))
      `.execute(db);
      console.log('✓ Created vector index');
    } catch (error: unknown) {
      const err = error as { code?: string; message?: string };
      if (err.code === 'ER_DUP_KEYNAME') {
        console.log('✓ Vector index already exists');
      } else {
        console.warn('⚠ Could not create vector index:', err.message ?? 'Unknown error');
        console.warn('Vector search will still work but may be slower without an index');
      }
    }

    // Create messages table
    await sql`
      CREATE TABLE IF NOT EXISTS messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        session_id VARCHAR(255) NOT NULL,
        role ENUM('user', 'assistant', 'system') NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_session_created (session_id, created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `.execute(db);
    console.log('✓ Created messages table');

    console.log('Database setup completed successfully!');
  } catch (error) {
    console.error('Database setup failed:', error);
    throw error;
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  setupDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
