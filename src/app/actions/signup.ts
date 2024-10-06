'use server';

import {
  discordIdExists,
  registerUser,
  userExists,
} from '@/lib/db/dao/userDao';
import { registerUserSchema } from '@/lib/db/validation';
import bcryptjs from 'bcryptjs';

export interface State {
  isSuccess: boolean;
  errors?: {
    username?: string[];
    discordId?: string[];
    password?: string[];
  };
  message?: string | null;
}

export async function signUp(
  prevState: State,
  formData: FormData
): Promise<State> {
  const validatedFields = registerUserSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      isSuccess: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'フォームに入力された内容が正しくありません。',
    };
  }

  const { username, discordId, password } = validatedFields.data;

  try {
    const hashedPassword = await bcryptjs.hash(password, 10);

    const isUserExisting = await userExists(username);
    const isDiscordIdExisting = await discordIdExists(discordId);

    if (isUserExisting || isDiscordIdExisting) {
      return {
        isSuccess: false,
        errors: {
          username: isUserExisting
            ? ['このユーザー名は既に登録されています。']
            : undefined,
          discordId: isDiscordIdExisting
            ? ['このDiscordIdは既に登録されています。']
            : undefined,
        },
        message: 'アカウント登録に失敗しました。',
      };
    }

    await registerUser(username, discordId, hashedPassword);

    return { isSuccess: true, message: 'アカウントを登録しました' };
  } catch (error) {
    if (error instanceof Error) {
      console.error('アカウント登録中にエラーが発生しました。:' + error.stack);
    } else {
      console.error(error);
    }

    return {
      isSuccess: false,
      message: 'アカウント登録に失敗しました。',
    };
  }
}
