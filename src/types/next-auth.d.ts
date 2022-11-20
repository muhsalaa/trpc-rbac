import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      role: string;
      status: string;
      id: string;
    } & DefaultSession['user']; // keep user default session
  }

  interface User {
    role: string;
    status: string;
  }
}
