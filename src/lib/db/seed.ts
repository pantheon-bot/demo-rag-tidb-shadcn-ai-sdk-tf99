import db from './db';
import { generateEmbedding } from '../ai/embeddings';

/**
 * Sample documents for RAG knowledge base
 * These are facts about TiDB that the AI can retrieve
 */
const sampleDocuments = [
  {
    content: 'TiDB is a distributed SQL database that supports hybrid transactional and analytical processing (HTAP) workloads. It is MySQL compatible and features horizontal scalability, strong consistency, and high availability.',
    source: 'tidb_overview',
  },
  {
    content: 'TiDB Cloud is a fully-managed Database-as-a-Service (DBaaS) that brings TiDB to the cloud. It offers automatic scaling, backup and restore, and monitoring capabilities.',
    source: 'tidb_cloud',
  },
  {
    content: 'TiDB supports vector search capabilities starting from version 8.4.0. You can store vector embeddings using the VECTOR data type and perform similarity searches using functions like VEC_COSINE_DISTANCE.',
    source: 'tidb_vector_search',
  },
  {
    content: 'The VECTOR data type in TiDB stores fixed-dimension vector embeddings. You define it as VECTOR(n) where n is the number of dimensions. For example, VECTOR(1536) for OpenAI embeddings.',
    source: 'tidb_vector_type',
  },
  {
    content: 'To create a vector search index in TiDB, use: CREATE VECTOR INDEX idx_name ON table_name ((VEC_COSINE_DISTANCE(column_name))). This uses the HNSW algorithm for efficient similarity search.',
    source: 'tidb_vector_index',
  },
  {
    content: 'TiDB vector search supports two distance functions: VEC_COSINE_DISTANCE for cosine similarity and VEC_L2_DISTANCE for Euclidean distance. Choose the one that matches your embedding model.',
    source: 'tidb_distance_functions',
  },
  {
    content: 'Kysely is a type-safe SQL query builder for TypeScript. It provides excellent TypeScript support and works well with TiDB through the mysql2 driver.',
    source: 'kysely_info',
  },
  {
    content: 'Next.js 16 introduces improved performance with React 19 support, enhanced caching strategies, and better developer experience. The App Router is now the recommended approach for new applications.',
    source: 'nextjs_16',
  },
];

/**
 * Seed the database with sample documents and their embeddings
 */
export async function seedDocuments() {
  console.log('Starting to seed documents...');

  // Check if documents already exist
  const existingDocs = await db
    .selectFrom('documents')
    .select(db.fn.count('id').as('count'))
    .executeTakeFirst();

  if (existingDocs && Number(existingDocs.count) > 0) {
    console.log(`Database already contains ${existingDocs.count} documents. Skipping seed.`);
    return;
  }

  // Generate embeddings and insert documents
  for (const doc of sampleDocuments) {
    console.log(`Generating embedding for: ${doc.source}`);
    const embedding = await generateEmbedding(doc.content);

    await db
      .insertInto('documents')
      .values({
        content: doc.content,
        embedding,
        source: doc.source,
        metadata: null,
      })
      .execute();

    console.log(`✓ Inserted document: ${doc.source}`);
  }

  console.log(`Successfully seeded ${sampleDocuments.length} documents!`);
}

// Run seed if this file is executed directly
if (require.main === module) {
  seedDocuments()
    .then(() => {
      console.log('Seed completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seed failed:', error);
      process.exit(1);
    });
}
