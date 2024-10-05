import z from 'zod';
import { publicProcedure, router } from '../trpc';
import chatsService from './chats.service';

export const chatsRouter = router({
  chats: router({
    createOne: publicProcedure.mutation(async () => {
      return chatsService.createOne();
    }),

    getOne: publicProcedure.input(z.object({ id: z.string().uuid() })).query(async (opts) => {
      const { input } = opts;
      return chatsService.getOne(input.id);
    }),

    addMessage: publicProcedure
      .input(z.object({ chatId: z.string().uuid(), text: z.string(), who: z.literal('user') }))
      .mutation(async (opts) => {
        const { input } = opts;
        chatsService.addMessage(input.chatId, input.text, input.who);
      }),
  }),
});
