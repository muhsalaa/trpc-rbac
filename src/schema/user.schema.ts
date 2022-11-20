import { z } from 'zod';

// ================ CREATE USER SCHEMA ================
export const createUserSchema = z
  .object({
    name: z.string().min(1, { message: 'Name must not be empty' }),
    email: z.string().email(),
  })
  .required();

export type CreateUserInput = z.TypeOf<typeof createUserSchema>;

// ================ LOGIN USER SCHEMA ================
export const loginUserSchema = z
  .object({
    email: z.string().email(),
  })
  .required();

export type LoginUserInput = z.TypeOf<typeof loginUserSchema>;
