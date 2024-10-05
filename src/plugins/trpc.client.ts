import { httpBatchLink } from '@trpc/client';
import { createTRPCNuxtClient } from 'trpc-nuxt/client';
import type { AppRouter } from '~/server/api/[trpc]';

export default defineNuxtPlugin(() => {
  const trpc = createTRPCNuxtClient<AppRouter>({
    links: [
      httpBatchLink({
        url: '/api',
      }),
    ],
  });

  return {
    provide: {
      trpc,
    },
  };
});
