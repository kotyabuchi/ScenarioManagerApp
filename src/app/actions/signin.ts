'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

export async function authenticate(
  prevState: { success: boolean; error?: string } | undefined,
  formData: FormData
) {
  try {
    const result = await signIn('credentials', {
      redirect: false,
      username: formData.get('username'),
      password: formData.get('password'),
    });

    if (result?.error) {
      return { success: false, error: 'Invalid credentials.' };
    }

    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return {
            success: false,
            error: 'ユーザー名またはパスワードが間違っています。',
          };
        default:
          return { success: false, error: 'ログインに失敗しました。' };
      }
    }
    return { success: false, error: 'An unexpected' };
  }
}
