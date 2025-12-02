# TiDB RAG Chat Demo

A fully functional Retrieval-Augmented Generation (RAG) chat application built with Next.js 16, TiDB Cloud Serverless, AI SDK, and shadcn/ui.

## Features

- **TiDB Vector Search**: Uses TiDB's native VECTOR data type and VEC_COSINE_DISTANCE for similarity search
- **Persistent Message History**: All conversations stored in TiDB for historical context
- **AI SDK Integration**: Streaming responses powered by OpenAI GPT-4 mini and text-embedding-3-small
- **Modern UI**: Beautiful, responsive interface built with shadcn/ui components
- **Type-Safe Database**: Kysely query builder with TypeScript for compile-time safety

## Architecture

### Database Schema

The application uses two main tables:

#### `documents` table
- Stores knowledge base content with vector embeddings
- Uses `VECTOR(1536)` type for OpenAI embeddings
- Includes vector index for fast similarity search
- Fields: id, content, embedding, source, metadata, created_at

#### `messages` table
- Stores conversation history
- Fields: id, session_id, role, content, created_at
- Indexed on (session_id, created_at) for efficient queries

### RAG Flow

1. **User Query** → Converted to vector embedding using OpenAI text-embedding-3-small (1536 dimensions)
2. **Vector Search** → TiDB performs cosine similarity search to find top 3 most relevant documents
3. **Context Building** → Retrieved documents formatted as context for the LLM
4. **LLM Generation** → GPT-4 mini generates response with context + conversation history
5. **Persistence** → Both user message and assistant response saved to TiDB

## Project Structure

```
src/
├── app/
│   ├── page.tsx                 # Landing page with demo overview
│   ├── chat/
│   │   └── page.tsx            # Chat interface (client component)
│   └── api/
│       └── chat/
│           └── route.ts        # API route for chat completions with RAG
├── lib/
│   ├── db/
│   │   ├── db.ts               # Kysely instance configuration
│   │   ├── schema.d.ts         # TypeScript schema definitions
│   │   ├── setup-db.ts         # Database table creation script
│   │   ├── seed.ts             # Seed sample documents with embeddings
│   │   └── migrations/
│   │       └── 001_initial_schema.sql
│   ├── ai/
│   │   ├── embeddings.ts       # Embedding generation utilities
│   │   └── rag.ts              # RAG functions (search, context building)
│   └── utils.ts                # Utility functions (cn, etc.)
└── components/
    └── ui/                     # shadcn/ui components
```

## Setup & Running

### Prerequisites

- Node.js 18+
- TiDB Cloud Serverless cluster (version 8.4.0+ for vector support)
- OpenAI API key

### Environment Variables

Add to `.env.local`:

```bash
DATABASE_URL=mysql://[user]:[password]@[host]/[database]
OPENAI_API_KEY=sk-...
```

### Installation

```bash
# Install dependencies
npm install

# Setup database tables
npx tsx src/lib/db/setup-db.ts

# Seed sample documents
npx tsx src/lib/db/seed.ts

# Start development server
npm run dev
```

The app will be available at http://localhost:3000

## Knowledge Base

The demo includes 8 seeded documents about:
- TiDB overview and features
- TiDB Cloud
- TiDB Vector Search capabilities
- VECTOR data type usage
- Vector indexes and distance functions
- Kysely query builder
- Next.js 16 features

You can add more documents by:
1. Adding entries to `src/lib/db/seed.ts`
2. Running `npx tsx src/lib/db/seed.ts`

Or programmatically insert via:
```typescript
import db from '@/lib/db';
import { generateEmbedding } from '@/lib/ai/embeddings';

const embedding = await generateEmbedding('Your content here');
await db.insertInto('documents').values({
  content: 'Your content here',
  embedding,
  source: 'source-name',
  metadata: null,
}).execute();
```

## API Routes

### POST /api/chat

Handles chat completions with RAG.

**Request body:**
```json
{
  "messages": [
    { "role": "user", "content": "What is TiDB?" }
  ],
  "sessionId": "optional-session-id"
}
```

**Response:**
- Streaming text response
- Automatically saves messages to database
- Includes relevant context from vector search

## Key Technologies

- **Next.js 16**: App Router, React Server Components, API Routes
- **TiDB Cloud Serverless**: MySQL-compatible distributed database with vector search
- **Kysely**: Type-safe SQL query builder for TypeScript
- **AI SDK**: Vercel AI SDK for LLM integrations and streaming
- **OpenAI**: GPT-4 mini for chat, text-embedding-3-small for embeddings
- **shadcn/ui**: Beautiful, accessible React components
- **Tailwind CSS v4**: Utility-first CSS framework

## Performance Considerations

- Vector index creation requires TiFlash replicas (may take 10-20 minutes for large datasets)
- Without vector index, search still works but may be slower
- Consider pagination for message history in production
- Implement rate limiting for API routes

## Next Steps

To extend this demo:

1. **Add authentication**: Tie sessions to user accounts
2. **Implement chat history UI**: Show past conversations
3. **Add file upload**: Extract text from PDFs/docs and embed them
4. **Fine-tune retrieval**: Adjust top-k, try different distance metrics
5. **Add streaming UI**: Show tokens as they arrive (already supported server-side)
6. **Implement feedback**: Allow users to rate responses
7. **Add citations**: Show which documents were used for each response

## Troubleshooting

### Vector index creation fails
- Ensure TiDB version is 8.4.0 or later
- Check if TiFlash replica is enabled: `ALTER TABLE documents SET TIFLASH REPLICA 1;`
- Vector search will work without index, just slower

### Embeddings fail
- Verify OPENAI_API_KEY is set correctly
- Check OpenAI API quota and rate limits

### Database connection fails
- Verify DATABASE_URL is correct
- Ensure TLS 1.2+ is supported (required by TiDB Cloud)

## License

MIT

## References

- [TiDB Vector Search Documentation](https://docs.pingcap.com/tidbcloud/vector-search-overview)
- [AI SDK Documentation](https://ai-sdk.dev/)
- [Next.js App Router](https://nextjs.org/docs/app)
- [shadcn/ui](https://ui.shadcn.com/)
