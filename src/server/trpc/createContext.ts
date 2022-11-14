import { type inferAsyncReturnType } from "@trpc/server";
import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession as getServerSession } from "next-auth/next";

import { prisma } from "../db/client";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export async function createContext({
  req,
  res,
}: {
  req: NextApiRequest;
  res: NextApiResponse;
}) {
  const session = await getServerSession(req, res, authOptions);

  return { req, res, prisma, session };
}

export type Context = inferAsyncReturnType<typeof createContext>;
