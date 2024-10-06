import { drizzle, DrizzleD1Database } from 'drizzle-orm/d1';
import { schema } from './schema';

type DbType = DrizzleD1Database<typeof schema>;
let db: DbType;

export function getDb() {
  if (!db) {
    if (!process.env.DB) {
      throw new Error('DBが存在しません。');
    }
    db = drizzle(process.env.DB as unknown as D1Database, { schema });
  }
  return db;
}
