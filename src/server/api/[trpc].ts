import { createNuxtApiHandler } from 'trpc-nuxt';
import { chatsRouter } from '../chat/chat.router';
import { mergeRouters } from '../trpc';

const appRouter = mergeRouters(chatsRouter);

export type AppRouter = typeof appRouter;

export default createNuxtApiHandler({
  router: appRouter,
  createContext: () => ({}),
});
