import { Generated, ColumnType } from 'kysely';

export interface DB {
  documents: DocumentsTable;
  messages: MessagesTable;
}

export interface DocumentsTable {
  id: Generated<number>;
  content: string;
  embedding: string; // VECTOR type is represented as string in Kysely
  source: string | null;
  metadata: ColumnType<Record<string, any> | null, string | null, string | null>; // JSON type
  created_at: Generated<Date>;
}

export interface MessagesTable {
  id: Generated<number>;
  session_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at: Generated<Date>;
}