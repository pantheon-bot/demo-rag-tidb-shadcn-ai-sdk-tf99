import { openai } from '@ai-sdk/openai';
import { embed } from 'ai';

/**
 * Generate embedding vector for text using OpenAI text-embedding-3-small
 * Returns a 1536-dimensional vector as a string in format "[0.1, 0.2, ...]"
 */
export async function generateEmbedding(text: string): Promise<string> {
  const { embedding } = await embed({
    model: openai.embedding('text-embedding-3-small'),
    value: text,
  });

  // Convert number array to TiDB VECTOR string format
  return `[${embedding.join(',')}]`;
}

/**
 * Generate embeddings for multiple texts in batch
 */
export async function generateEmbeddings(texts: string[]): Promise<string[]> {
  const embeddings = await Promise.all(
    texts.map(text => generateEmbedding(text))
  );
  return embeddings;
}
