import { router, publicProcedure, protectedProcedure } from '../trpc';
import {
  createUserSchema,
  deleteUserDataSchema,
  editUserSchema,
  getUserDataSchema,
  loginUserSchema,
  getAllUserDataSchema,
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
  registerFirstUser: publicProcedure
    .input(createUserSchema)
    .mutation(async ({ input, ctx }) => {
      const { email, name } = input;

      // only allow registration if user role isnt USER and user email is ADMIN (initial user)
      if (email !== process.env.ADMIN_EMAIL) {
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
            role: Role.ADMIN,
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
  registerUser: protectedProcedure
    .input(createUserSchema)
    .mutation(async ({ input, ctx }) => {
      const { email, name } = input;
      const actorRole = ctx.session?.user?.role;

      // only allow registration if user role isnt USER and user email is ADMIN (initial user)
      if (actorRole === Role.USER) {
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
            role: Role.USER,
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
  getAllUser: protectedProcedure
    .input(getAllUserDataSchema)
    .query(async ({ ctx, input }) => {
      const role = ctx.session.user.role;

      if (role === ROLES.USER) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You cant view this data.',
        });
      }

      const total = await ctx.prisma.user.count();
      const users = await ctx.prisma.user.findMany({
        where: {
          role:
            role === ROLES.ADMIN
              ? undefined
              : {
                  not: ROLES.ADMIN as Role,
                },
        },
        orderBy: {
          createdAt: 'asc',
        },
        take: input.per_page,
        skip: (input.page - 1) * input.per_page,
      });

      return { users, total };
    }),
  editUser: protectedProcedure
    .input(editUserSchema)
    .mutation(async ({ input, ctx }) => {
      const { id, ...data } = input;
      const actorRole = ctx.session?.user?.role;
      const targetUser = await ctx.prisma.user.findUnique({
        where: {
          id,
        },
      });

      if (targetUser) {
        const isAuthorizedToEdit = checkManageUserAuthorization(
          actorRole,
          targetUser.role
        );
        const isEmailChanged = targetUser.email !== data.email;

        if (isAuthorizedToEdit) {
          await ctx.prisma.user.update({
            where: {
              id,
            },
            // change status to NEW when email is changed
            data: {
              ...data,
              ...(isEmailChanged && {
                status: Status.NEW,
                emailVerified: null,
              }),
            },
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
          message: 'User not found',
        });
      }
    }),
  deleteUser: protectedProcedure
    .input(deleteUserDataSchema)
    .mutation(async ({ input, ctx }) => {
      const { id } = input;
      const actorRole = ctx.session?.user?.role;
      const targetUser = await ctx.prisma.user.findUnique({
        where: {
          id,
        },
      });

      if (targetUser) {
        const isAuthorizedToDelete = checkManageUserAuthorization(
          actorRole,
          targetUser.role
        );
        if (isAuthorizedToDelete) {
          await ctx.prisma.user.delete({
            where: {
              id,
            },
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
          message: 'User not found',
        });
      }
    }),
});
