import { router, publicProcedure, protectedProcedure } from '../trpc';
import {
  createUserSchema,
  getUserDataSchema,
  loginUserSchema,
} from '@/schema/user.schema';
import { TRPCError } from '@trpc/server';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { ROLES } from '@/constants/role';
import { Role, Status } from '@prisma/client';

export const userRouter = router({
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

      if (user.status === Status.BANNED) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message:
            'Your account is temporary unable to login, please contact your supervisor.',
        });
      }

      return true;
    }),
  /**
   * This register flow support initial admin registration only
   * later admin will create other accounts for his subordinates
   * this flow useful if one application will be used by 1 company
   *
   * if want to provide more global registration,
   * just remove the condition that check ADMIN_EMAIL data
   */
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
        await ctx.prisma.user.create({
          data: {
            email,
            name,
            role: 'ADMIN',
          },
        });

        return true;
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
  getMe: protectedProcedure
    .input(getUserDataSchema)
    .query(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found',
        });
      }

      return user;
    }),
  getAllUser: protectedProcedure.query(async ({ ctx }) => {
    const role = ctx.session.user.role;

    if (role === ROLES.USER) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Restricted content',
      });
    }

    const users = await ctx.prisma.user.findMany(
      role === ROLES.ADMIN
        ? undefined
        : {
            where: {
              role: {
                not: ROLES.ADMIN as Role,
              },
            },
          }
    );

    return users;
  }),
});
