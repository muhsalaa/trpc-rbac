import NextAuth, { type NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import { prisma } from "@/server/db/client";

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
      console.log(user);

      return true;
    },
  },
  pages: {
    // signIn: "/auth/login",
    // signOut: "/auth/logout",
  },
  session: {
    maxAge: 10 * 24 * 60 * 60,
  },
};

export default NextAuth(authOptions);
