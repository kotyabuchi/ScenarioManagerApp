'use server';

import { signOut } from '@/auth';

export async function signout(): Promise<boolean> {
  try {
    await signOut({ redirect: false });

    return true;
  } catch (error) {
    return false;
  }
}
