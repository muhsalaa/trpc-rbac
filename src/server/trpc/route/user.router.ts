import { createUserSchema } from "@/schema/user.schema";
import { createRouter } from "../createRouter";

export const userRouter = createRouter().query("dummy-user", {
  input: createUserSchema,
  resolve: ({ input }) => {
    return {
      message: `Hello ${input.name}!!!`,
    };
  },
});
