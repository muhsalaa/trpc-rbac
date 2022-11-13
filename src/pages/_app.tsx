import type { AppProps } from "next/app";
import { withTRPC } from "@trpc/next";
import { httpBatchLink } from "@trpc/client/links/httpBatchLink";
import { loggerLink } from "@trpc/client/links/loggerLink";
import SuperJSON from "superjson";

import { AppRouter } from "@/server/route/app.router";
import { url } from "@/constants/url";

import "../styles/globals.css";

function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

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
