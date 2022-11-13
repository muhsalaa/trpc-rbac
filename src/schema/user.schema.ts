import { z } from "zod";

// ================ CREATE USER SCHEMA ================
export const createUserSchema = z
  .object({
    name: z.string().min(1, { message: "Name must not be empty" }),
  })
  .required();

export type CreateUserInput = z.TypeOf<typeof createUserSchema>;
