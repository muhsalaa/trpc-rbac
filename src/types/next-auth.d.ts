import { DefaultSession } from 'next-auth';
import { Role } from '@prisma/client';

declare module 'next-auth' {
  interface Session {
    user: {
      role: Role;
      status: string;
      id: string;
    } & DefaultSession['user']; // keep user default session
  }

  interface User {
    role: Role;
    status: string;
  }
}
