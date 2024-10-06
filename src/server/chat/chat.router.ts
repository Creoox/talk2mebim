import z from 'zod';
import { publicProcedure, router } from '../trpc';
import chatsService from './chat.service';

export const chatsRouter = router({
  chat: router({
    createOne: publicProcedure
      .input(z.object({ xeoUrl: z.string().url() }))
      .mutation(async (opts) => {
        const { input } = opts;
        return chatsService.createOne(input.xeoUrl);
      }),

    getOne: publicProcedure.input(z.object({ id: z.string().uuid() })).query(async (opts) => {
      const { input } = opts;
      return chatsService.getOne(input.id);
    }),

    addMessage: publicProcedure
      .input(z.object({ chatId: z.string().uuid(), text: z.string(), who: z.union([ z.literal('user'), z.literal('system'), z.literal('ai')]) }))
      .mutation(async (opts) => {
        const { input } = opts;
        chatsService.addMessage(input.chatId, input.text, input.who);
      }),
  }),
});
