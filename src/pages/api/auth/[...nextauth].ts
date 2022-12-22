import NextAuth, { type NextAuthOptions } from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import { PrismaAdapter } from '@next-auth/prisma-adapter';

import { prisma } from '@/server/db/client';
import { Status } from '@prisma/client';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      session.user = Object.assign(session.user, {
        role: user.role,
        id: user.id,
        status: user.status,
      });

      return session;
    },
    async signIn({ user }) {
      if (user.status === Status.NEW) {
        await prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            status: Status.ACTIVE,
          },
        });

        return true;
      }

      if (user.status === Status.BANNED) {
        // todos: create page for banned user
        return false;
      }

      return true;
    },
  },
  pages: {
    signIn: '/auth/login',
    verifyRequest: '/auth/verify-request',
  },
  session: {
    maxAge: 10 * 24 * 60 * 60,
  },
  secret: process.env.SECRET,
};

export default NextAuth(authOptions);
