import db from '../db';
import { sql } from 'kysely';
import { generateEmbedding } from './embeddings';

export interface RelevantDocument {
  id: number;
  content: string;
  source: string | null;
  distance: number;
}

/**
 * Perform vector similarity search to find relevant documents
 * @param query - The user's query text
 * @param topK - Number of most relevant documents to return (default: 3)
 * @returns Array of relevant documents sorted by relevance
 */
export async function searchRelevantDocuments(
  query: string,
  topK: number = 3
): Promise<RelevantDocument[]> {
  // Generate embedding for the query
  const queryEmbedding = await generateEmbedding(query);

  // Perform vector similarity search using TiDB's VEC_COSINE_DISTANCE
  const results = await sql<RelevantDocument>`
    SELECT
      id,
      content,
      source,
      VEC_COSINE_DISTANCE(embedding, ${queryEmbedding}) as distance
    FROM documents
    ORDER BY distance ASC
    LIMIT ${topK}
  `.execute(db);

  return results.rows;
}

/**
 * Build RAG context from relevant documents
 * @param documents - Array of relevant documents
 * @returns Formatted context string for LLM prompt
 */
export function buildRagContext(documents: RelevantDocument[]): string {
  if (documents.length === 0) {
    return 'No relevant context found.';
  }

  const contextParts = documents.map((doc, index) => {
    return `[${index + 1}] ${doc.content}`;
  });

  return `Relevant context from knowledge base:\n\n${contextParts.join('\n\n')}`;
}

/**
 * Save a message to the database
 */
export async function saveMessage(
  sessionId: string,
  role: 'user' | 'assistant' | 'system',
  content: string
) {
  await db
    .insertInto('messages')
    .values({
      session_id: sessionId,
      role,
      content,
    })
    .execute();
}

/**
 * Get message history for a session
 */
export async function getMessageHistory(
  sessionId: string,
  limit: number = 10
) {
  const messages = await db
    .selectFrom('messages')
    .select(['id', 'role', 'content', 'created_at'])
    .where('session_id', '=', sessionId)
    .orderBy('created_at', 'desc')
    .limit(limit)
    .execute();

  // Reverse to get chronological order (oldest first)
  return messages.reverse();
}
