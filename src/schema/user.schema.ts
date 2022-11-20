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

// ================ GET USER DATA SCHEMA ================
export const getUserDataSchema = z
  .object({
    id: z.string().min(1, { message: 'Id must not be empty' }),
  })
  .required();

export type GetUserDataInput = z.TypeOf<typeof getUserDataSchema>;
