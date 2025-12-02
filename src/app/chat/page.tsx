'use client';

import { useChat } from '@ai-sdk/react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User } from 'lucide-react';

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    body: {
      sessionId: 'demo-session-' + Date.now(), // Simple session management
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100 p-4 dark:from-zinc-950 dark:to-black">
      <Card className="flex h-[600px] w-full max-w-3xl flex-col">
        {/* Header */}
        <div className="border-b border-zinc-200 bg-gradient-to-r from-zinc-50 to-white p-4 dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-950">
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            TiDB RAG Chat Demo
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Ask questions about TiDB, Kysely, or Next.js
          </p>
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center space-y-4 text-center">
              <Bot className="h-12 w-12 text-zinc-400" />
              <div>
                <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">
                  Welcome to TiDB RAG Chat
                </h2>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  This demo uses TiDB vector search to retrieve relevant information
                  <br />
                  and answer your questions with context-aware responses.
                </p>
              </div>
              <div className="mt-4 space-y-2 rounded-lg bg-zinc-100 p-4 text-left text-sm dark:bg-zinc-900">
                <p className="font-medium text-zinc-900 dark:text-zinc-50">
                  Try asking:
                </p>
                <ul className="space-y-1 text-zinc-700 dark:text-zinc-300">
                  <li>• What is TiDB?</li>
                  <li>• How do I use vector search in TiDB?</li>
                  <li>• What distance functions does TiDB support?</li>
                  <li>• Tell me about Kysely</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-3 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-900 dark:bg-zinc-100">
                      <Bot className="h-5 w-5 text-zinc-50 dark:text-zinc-900" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      message.role === 'user'
                        ? 'bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900'
                        : 'bg-zinc-100 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-50'
                    }`}
                  >
                    <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                  </div>
                  {message.role === 'user' && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-900 dark:bg-zinc-100">
                      <User className="h-5 w-5 text-zinc-50 dark:text-zinc-900" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-900 dark:bg-zinc-100">
                    <Bot className="h-5 w-5 text-zinc-50 dark:text-zinc-900" />
                  </div>
                  <div className="flex items-center space-x-2 rounded-lg bg-zinc-100 px-4 py-2 dark:bg-zinc-900">
                    <div className="h-2 w-2 animate-bounce rounded-full bg-zinc-600 [animation-delay:-0.3s]"></div>
                    <div className="h-2 w-2 animate-bounce rounded-full bg-zinc-600 [animation-delay:-0.15s]"></div>
                    <div className="h-2 w-2 animate-bounce rounded-full bg-zinc-600"></div>
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t border-zinc-200 p-4 dark:border-zinc-800">
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Ask a question..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading || !input?.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
