import { router } from "@trpc/server";
import SuperJSON from "superjson";

import { Context } from "./createContext";

export function createRouter() {
  return router<Context>().transformer(SuperJSON);
}
