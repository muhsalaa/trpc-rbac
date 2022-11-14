import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { withTRPC } from "@trpc/next";
import { httpBatchLink } from "@trpc/client/links/httpBatchLink";
import { loggerLink } from "@trpc/client/links/loggerLink";
import { SessionProvider } from "next-auth/react";
import SuperJSON from "superjson";

import { AppRouter } from "@/server/trpc/route/app.router";
import { url } from "@/constants/url";

import "../styles/globals.css";

const App: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
};

export default withTRPC<AppRouter>({
  config() {
    const links = [
      loggerLink(),
      // configure maximum request batching that can be done
      httpBatchLink({
        url,
        maxBatchSize: 3,
      }),
    ];

    // global config for react-query
    return {
      queryClientConfig: {
        defaultOptions: {
          queries: {
            staleTime: 60,
            refetchOnWindowFocus: false,
          },
        },
      },
      links,
      transformer: SuperJSON,
    };
  },
  ssr: false,
})(App);
