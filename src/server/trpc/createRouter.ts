import { router, TRPCError } from "@trpc/server";
import SuperJSON from "superjson";

import { Context } from "./createContext";

export function createRouter() {
  return router<Context>()
    .transformer(SuperJSON)
    .formatError(({ shape }) => {
      return shape;
    });
}

export function createProtectedRouter() {
  return createRouter().middleware(({ ctx, next }) => {
    if (!ctx.session || !ctx.session.user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    return next({
      ctx: {
        session: { ...ctx.session, user: ctx.session.user },
      },
    });
  });
}
