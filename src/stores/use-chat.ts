import { AppRouterOutput } from '~/server/api/[trpc]';
import { loadModelXKT } from '~/utils/viewer/loaders';

export const useChatStore = defineStore('chat-store', () => {
  const chat = ref<AppRouterOutput['chat']['getOne']>(undefined);
  const loadingTriggered = ref(false);
  const { $trpc } = useNuxtApp();

  async function load(id: string) {
    if (!id) return;

    const response = await $trpc.chat.getOne.query({ id });
    chat.value = response;

    if (loadingTriggered.value === false && response?.modelUrls) {
      console.log({ urls: response.modelUrls });
      loadingTriggered.value = true;
      await loadModelXKT(
        `xkt`,
        [
          'https://sos-ch-gva-2.exo.io/xeovision-upload-bucket-test/c3bbefe3-581c-4a4a-953a-0a2d4fcea88d?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=EXOb1372e2ef96592a23cf5f48e%2F20241005%2Fch-gva-2%2Fs3%2Faws4_request&X-Amz-Date=20241005T175529Z&X-Amz-Expires=3600&X-Amz-Signature=088f8c6c851bbdc4e23de85939e65bf1cfee40f58da7ffea08eaad7f1f47a116&X-Amz-SignedHeaders=host&response-content-disposition=attachment%3B%20filename%3D%22output.xkt%22&x-id=GetObject',
        ],
        //response.modelUrls.map((modelUrl) => modelUrl.url),
      );
    }

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
