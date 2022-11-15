import { router, publicProcedure, protectedProcedure } from "../trpc";
import { createUserSchema } from "@/schema/user.schema";

export const userRouter = router({
  dummyUser: publicProcedure.input(createUserSchema).query(({ input }) => {
    return {
      message: `Hello ${input.name}!!!`,
    };
  }),
  loginUser: protectedProcedure.query(() => {
    return "You are logged in and can see this secret message!";
  }),
});
