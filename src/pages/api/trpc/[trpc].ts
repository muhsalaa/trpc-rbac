import { createContext } from "@/server/trpc/context";
import { appRouter } from "@/server/trpc/router/_app";

import * as trpcNext from "@trpc/server/adapters/next";

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: createContext,
  onError({ error, path }) {
    if (error.code === "INTERNAL_SERVER_ERROR") {
      console.error(`❌ tRPC failed on ${path}: ${error}`);
    } else {
      console.error(error);
    }
  },
});
