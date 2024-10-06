import NextAuth, { Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import bcryptjs from 'bcryptjs';
import { getUserByUsername } from './lib/db/dao/userDao';

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        console.log('start authorize');

        const parsedCredentials = z
          .object({ username: z.string(), password: z.string() })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { username, password } = parsedCredentials.data;
          const user = await getUserByUsername(username);
          if (!user) return null;
          const passwordsMatch = await bcryptjs.compare(
            password,
            user.password
          );

          if (passwordsMatch) return user;
        }

        console.log('Invalid credentials');
        return null;
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user, trigger, session }): Promise<JWT> {
      if (user && user.id && user.name) {
        token.id = user.id;
        token.username = user.username;
        token.nickname = user.nickname;
        token.avatar = user.avatar;
      }

      if (trigger === 'update' && session) {
        token = { ...token, ...session };
        return token;
      }

      return token;
    },
    async session({
      session,
      token,
    }: {
      session: Session;
      token: JWT;
    }): Promise<Session> {
      if (session.user) {
        session.user.id = token.id;
        session.user.username = token.username;
        session.user.nickname = token.nickname;
        session.user.avatar = token.avatar;
      }
      return session;
    },
  },
});
