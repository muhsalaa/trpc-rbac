import { router, publicProcedure, protectedProcedure } from '../trpc';
import {
  createUserSchema,
  editUserSchema,
  getUserDataSchema,
  loginUserSchema,
} from '@/schema/user.schema';
import { TRPCError } from '@trpc/server';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { ROLES } from '@/constants/role';
import { Role, Status } from '@prisma/client';
import { checkManageUserAuthorization } from '@/utils/authorization';

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
      const actorRole = ctx.session?.user?.role;

      // only allow registration if user role isnt USER and user email is ADMIN (initial user)
      if (
        actorRole ? actorRole === Role.USER : email !== process.env.ADMIN_EMAIL
      ) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Only admin and maintainer can register new user',
        });
      }

      try {
        await ctx.prisma.user.create({
          data: {
            email,
            name,
            role: email === process.env.ADMIN_EMAIL ? Role.ADMIN : Role.USER,
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
        message: 'You cant view this data.',
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
  editUser: protectedProcedure
    .input(editUserSchema)
    .mutation(async ({ input, ctx }) => {
      const { id, ...data } = input;
      const actorRole = ctx.session?.user?.role;
      const targetUser = await ctx.prisma.user.findFirst({
        where: {
          id,
        },
      });

      if (targetUser) {
        const isAuthorizedToEdit = checkManageUserAuthorization(
          actorRole,
          targetUser.role
        );
        if (isAuthorizedToEdit) {
          await ctx.prisma.user.update({
            where: {
              id,
            },
            data,
          });
        } else {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'You cant edit this user data.',
          });
        }
      } else {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Something went wrong',
        });
      }
    }),
});
