import { createNuxtApiHandler } from 'trpc-nuxt';
import { chatsRouter } from '../trpc/chats/chats.router';
import { mergeRouters } from '../trpc/trpc';

const appRouter = mergeRouters(chatsRouter);

export type AppRouter = typeof appRouter;

export default createNuxtApiHandler({
  router: appRouter,
  createContext: () => ({}),
});
