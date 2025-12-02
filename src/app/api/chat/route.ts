import { openai } from '@ai-sdk/openai';
import { streamText, convertToModelMessages } from 'ai';
import { searchRelevantDocuments, buildRagContext, saveMessage } from '@/lib/ai/rag';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, sessionId } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response('Invalid request: messages array is required', {
        status: 400,
      });
    }

    // Use a default session ID if not provided
    const effectiveSessionId = sessionId || 'default-session';

    // Get the latest user message
    const userMessage = messages[messages.length - 1];
    if (userMessage.role !== 'user') {
      return new Response('Invalid request: last message must be from user', {
        status: 400,
      });
    }

    // Save user message to database
    await saveMessage(effectiveSessionId, 'user', userMessage.content);

    // Perform RAG: search for relevant documents
    const relevantDocs = await searchRelevantDocuments(userMessage.content, 3);
    const ragContext = buildRagContext(relevantDocs);

    console.log('RAG Context:', ragContext);
    console.log('Found documents:', relevantDocs.map(d => d.source).join(', '));

    // Build system prompt with RAG context
    const systemMessage = {
      role: 'system' as const,
      content: `You are a helpful AI assistant with access to a knowledge base about TiDB, Kysely, and Next.js.

${ragContext}

Please answer the user's question based on the provided context. If the context contains relevant information, use it in your answer. If the context doesn't contain relevant information, you can still provide a helpful response based on your general knowledge, but mention that you don't have specific information from the knowledge base.`,
    };

    // Convert UI messages to model messages and add system prompt
    const modelMessages = [
      systemMessage,
      ...convertToModelMessages(messages),
    ];

    // Generate streaming response
    const result = streamText({
      model: openai('gpt-4o-mini'),
      messages: modelMessages,
      temperature: 0.7,
      async onFinish({ text }) {
        // Save assistant response to database
        await saveMessage(effectiveSessionId, 'assistant', text);
      },
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process chat request' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
