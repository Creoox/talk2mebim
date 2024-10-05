import { AppRouterOutput } from '~/server/api/[trpc]';

export const useChatStore = defineStore('chat-store', () => {
  const chat = ref<AppRouterOutput['chat']['getOne']>(undefined);
  const { $trpc } = useNuxtApp();

  async function load(id: string) {
    if (!id) return;

    const response = await $trpc.chat.getOne.query({ id });
    chat.value = response;
    return response;
  }

  async function addMessage(text: string) {
    if (chat.value === undefined) return;

    await $trpc.chat.addMessage.mutate({
      chatId: chat.value.id,
      text,
      who: 'user',
    });
  }

  return {
    chat,
    load,
    addMessage,
  };
});
