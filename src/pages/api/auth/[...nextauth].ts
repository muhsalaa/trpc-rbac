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
    async signIn({ user, email }) {
      // signIn callback is called twice, when send verify request and when user verified
      // this condition make sure only trigger code inside when action is verifying verificationRequest
      if (!email?.verificationRequest) {
        const targetUSer = await prisma.user.findUnique({
          where: {
            email: user.email!,
          },
        });

        // TODO: create page for unauthorized user
        if (!targetUSer) {
          return false;
        }

        // condition below make sure only change user status to ACTIVE when user verified
        if (user.status === Status.NEW) {
          await prisma.user.update({
            where: {
              id: user.id,
            },
            data: {
              // change user status to active if he verify his email
              status: Status.ACTIVE,
            },
          });

          return true;
        }

        if (user.status === Status.BANNED) {
          // TODO: create page for unauthorized user
          return false;
        }
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
