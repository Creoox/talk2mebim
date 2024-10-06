import { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import { createNuxtApiHandler } from 'trpc-nuxt';
import { chatsRouter } from '../chat/chat.router';
import { storeRouter } from '../store/store.router';
import { mergeRouters } from '../trpc';

const appRouter = mergeRouters(chatsRouter, storeRouter);

export type AppRouter = typeof appRouter;
export type AppRouterInput = inferRouterInputs<AppRouter>;
export type AppRouterOutput = inferRouterOutputs<AppRouter>;

export default createNuxtApiHandler({
  router: appRouter,
  createContext: () => ({}),
});
