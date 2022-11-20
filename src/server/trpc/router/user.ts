import { router, publicProcedure, protectedProcedure } from '../trpc';
import { createUserSchema, loginUserSchema } from '@/schema/user.schema';
import { TRPCError } from '@trpc/server';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

export const userRouter = router({
  // dummyUser: publicProcedure
  //   .input(createUserSchema)
  //   .query(async ({ input, ctx }) => {
  //     await ctx.prisma.user.deleteMany();
  //     return {
  //       message: `Hello ${input.name}!!!`,
  //     };
  //   }),
  loginUser: publicProcedure
    .input(loginUserSchema)
    .mutation(async ({ input, ctx }) => {
      const { email } = input;

      const user = await ctx.prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found',
        });
      }

      return true;
    }),
  registerUser: publicProcedure
    .input(createUserSchema)
    .mutation(async ({ input, ctx }) => {
      const { email, name } = input;

      if (email !== process.env.ADMIN_EMAIL) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Only admin can register new user',
        });
      }

      try {
        const user = await ctx.prisma.user.create({
          data: {
            email,
            name,
          },
        });

        return user;
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === 'P2002') {
            throw new TRPCError({
              code: 'CONFLICT',
              message: 'User already exist',
            });
          }
        }

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong',
        });
      }
    }),
  getMe: protectedProcedure.query(() => {
    return 'name';
  }),
});
