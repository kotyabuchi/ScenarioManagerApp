import { users } from '../schema';
import { eq } from 'drizzle-orm';
import { getDb } from '../db';

export async function getUserByUsername(username: string) {
  const db = getDb();
  return await db.query.users.findFirst({
    where: eq(users.username, username),
  });
}

export async function userExists(username: string): Promise<boolean> {
  const db = getDb();
  const user = await db.query.users.findFirst({
    where: eq(users.username, username),
  });

  return user !== undefined;
}

export async function discordIdExists(discordId: string): Promise<boolean> {
  const db = getDb();
  const user = await db.query.users.findFirst({
    where: eq(users.discordId, discordId),
  });

  return user !== undefined;
}

export async function registerUser(
  username: string,
  discordId: string,
  password: string
) {
  const db = getDb();
  await db.insert(users).values({
    username: username,
    nickname: username,
    discordId: discordId,
    password: password,
  });
}
