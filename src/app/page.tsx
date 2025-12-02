import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Database, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100 p-4 dark:from-zinc-950 dark:to-black">
      <main className="flex w-full max-w-4xl flex-col items-center justify-center gap-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
            TiDB RAG Chat Demo
          </h1>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            Experience Retrieval-Augmented Generation with TiDB Vector Search
          </p>
        </div>

        <div className="grid w-full gap-4 sm:grid-cols-3">
          <Card className="flex flex-col items-center gap-3 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-900 dark:bg-zinc-100">
              <Database className="h-6 w-6 text-zinc-50 dark:text-zinc-900" />
            </div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              TiDB Vector Search
            </h3>
            <p className="text-center text-xs text-zinc-600 dark:text-zinc-400">
              Native VECTOR type with cosine distance search
            </p>
          </Card>

          <Card className="flex flex-col items-center gap-3 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-900 dark:bg-zinc-100">
              <Sparkles className="h-6 w-6 text-zinc-50 dark:text-zinc-900" />
            </div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              AI SDK Integration
            </h3>
            <p className="text-center text-xs text-zinc-600 dark:text-zinc-400">
              Powered by OpenAI embeddings and GPT-4
            </p>
          </Card>

          <Card className="flex flex-col items-center gap-3 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-900 dark:bg-zinc-100">
              <MessageSquare className="h-6 w-6 text-zinc-50 dark:text-zinc-900" />
            </div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              Message History
            </h3>
            <p className="text-center text-xs text-zinc-600 dark:text-zinc-400">
              Persistent conversations stored in TiDB
            </p>
          </Card>
        </div>

        <Card className="w-full p-6">
          <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            How It Works
          </h2>
          <ol className="space-y-3 text-sm text-zinc-700 dark:text-zinc-300">
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-xs font-medium text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900">
                1
              </span>
              <span>
                Your question is converted to a vector embedding using OpenAI's text-embedding-3-small model
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-xs font-medium text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900">
                2
              </span>
              <span>
                TiDB performs a vector similarity search using VEC_COSINE_DISTANCE to find relevant documents
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-xs font-medium text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900">
                3
              </span>
              <span>
                Retrieved context is provided to GPT-4 along with your question for an informed response
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-xs font-medium text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900">
                4
              </span>
              <span>
                All messages are stored in TiDB for conversation history
              </span>
            </li>
          </ol>
        </Card>

        <Link href="/chat" className="w-full sm:w-auto">
          <Button size="lg" className="w-full text-base">
            Start Chatting
            <MessageSquare className="ml-2 h-5 w-5" />
          </Button>
        </Link>

        <p className="text-center text-xs text-zinc-500 dark:text-zinc-500">
          Built with Next.js 16, TiDB Cloud, Kysely, AI SDK, and shadcn/ui
        </p>
      </main>
    </div>
  );
}
