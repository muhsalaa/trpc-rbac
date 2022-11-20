import SuperJSON from 'superjson';
import { httpBatchLink, loggerLink } from '@trpc/client';
import { createTRPCNext } from '@trpc/next';

import { AppRouter } from '@/server/trpc/router/_app';

// == TODO: Add self deployment url ==
export const getBaseUrl = () => {
  if (typeof window !== 'undefined') return ''; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

export const trpc = createTRPCNext<AppRouter>({
  config() {
    const links = [
      loggerLink({
        enabled: (opts) =>
          process.env.NODE_ENV === 'development' ||
          (opts.direction === 'down' && opts.result instanceof Error),
      }),
      // configure maximum request batching that can be done
      httpBatchLink({
        url: `${getBaseUrl()}/api/trpc`,
        maxURLLength: 2083,
      }),
    ];

    return {
      transformer: SuperJSON,
      links,
    };
  },
  ssr: false,
});
