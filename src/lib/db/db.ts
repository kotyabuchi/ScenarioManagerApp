import { drizzle } from 'drizzle-orm/d1';
import { drizzle as drizzleSqlite } from 'drizzle-orm/better-sqlite3';
import { type DrizzleD1Database } from 'drizzle-orm/d1';
import { schema } from './schema';
import Database from 'better-sqlite3';
import path from 'path';

type DbType = DrizzleD1Database<typeof schema>;
let db: DbType;

function getLocalD1DB() {
  try {
    const basePath = path.resolve('.wrangler');
    const dbFile = require('fs')
      .readdirSync(basePath, { encoding: 'utf-8', recursive: true })
      .find((f: string) => f.endsWith('.sqlite'));

    if (!dbFile) {
      throw new Error('.sqliteファイルがありません。');
    }

    return path.resolve(basePath, dbFile);
  } catch (error) {
    console.error(error);
  }
}

export function getDb() {
  if (!db) {
    if (process.env.NODE_ENV === 'development') {
      const sqlite = new Database(getLocalD1DB());
      db = drizzleSqlite(sqlite, { schema }) as unknown as DbType;
    } else {
      if (!process.env.DB) {
        throw new Error('DBが存在しません。');
      }
      db = drizzle(process.env.DB as unknown as D1Database, { schema });
    }
  }
  return db;
}
