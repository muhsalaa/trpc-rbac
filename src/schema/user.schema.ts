import { z } from 'zod';
import { Role, Status } from '@prisma/client';

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

// ================ GET USER DATA SCHEMA ================
export const getAllUserDataSchema = z
  .object({
    page: z.number().min(1),
    per_page: z.number().min(2),
  })
  .required();

export type GetAllUserDataInput = z.TypeOf<typeof getAllUserDataSchema>;

// ================ EDIT USER SCHEMA ================
export const editUserSchema = z
  .object({
    id: z.string().min(1, { message: 'Id must not be empty' }),
    name: z.string().min(1, { message: 'Name must not be empty' }),
    email: z.string().email(),
    status: z.nativeEnum(Status),
    role: z.nativeEnum(Role),
  })
  .required();

export type EditUserInput = z.TypeOf<typeof editUserSchema>;

// ================ DELETE USER DATA SCHEMA ================
export const deleteUserDataSchema = getUserDataSchema;

export type DeleteUserDataInput = GetUserDataInput;
