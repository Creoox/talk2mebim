import { AppRouterOutput } from '~/server/api/[trpc]';
import { loadModelXKT } from '~/utils/viewer/loaders';

export const useChatStore = defineStore('chat-store', () => {
  const chat = ref<AppRouterOutput['chat']['getOne']>(undefined);
  const loadingTriggered = ref(false);
  const { $trpc } = useNuxtApp();

  async function load(id: string) {
    if (!id) return;

    const viewerStore = useViewerStore();

    const response = await $trpc.chat.getOne.query({ id });
    chat.value = response;

    if (loadingTriggered.value === false && response?.modelUrls) {
      console.log({ urls: response.modelUrls.map((modelUrl) => modelUrl.url) });
      loadingTriggered.value = true;
      await loadModelXKT(
        `xkt`,
        response.modelUrls.map((modelUrl) => modelUrl.url),
      );

      viewerStore.getAllMetaObjects();

      //console.log('getAllMetaObjects', {text});

      //await addMessage(text!, 'system');
    }

    return response;
  }

  async function addMessage(text: string, who?: 'user' | 'system' | 'ai') {
    if (chat.value === undefined) return;

    await $trpc.chat.addMessage.mutate({
      chatId: chat.value.id,
      text,
      who: who ?? 'user',
    });
  }

  return {
    chat,
    load,
    addMessage,
  };
});
