import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import storeService from './store.service';

export const storeRouter = router({
  store: router({
    storeMeta: publicProcedure
      .input(
        z.object({
          chatId: z.string().uuid(),
          metaObjects: z.array(
            z.object({
              id: z.string(),
              type: z.string().nullable(),
              name: z.string().nullable(),
              parent: z.string().nullable(),
              data: z.string().nullable(),
            }),
          ),
        }),
      )
      .mutation(async (opts) => {
        const { input } = opts;
        return storeService.storeMeta(input.chatId, input.metaObjects);
      }),
  }),
});
