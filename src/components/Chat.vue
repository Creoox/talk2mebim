<template>
  <div class="w-full h-full" @keyup.enter="addMessage">
    <div class="overflow-y-scroll h-[calc(100%-70px)] p-3 flex flex-col gap-3" id="chat-window">
      <ChatMessage
        v-for="message of chatStore.chat?.messages"
        :key="message.id"
        :text="message.text"
        :who="message.who"
      />
    </div>

    <div class="flex items-center p-3 gap-2">
      <InputText v-model="text" type="text" placeholder="Type your prompt" class="w-full" />
      <Button class="w-20" @click="addMessage">Send</Button>
    </div>
  </div>
</template>

<script setup lang="ts">
const chatStore = useChatStore();
const text = ref('');

function addMessage() {
  scrollToBottom();
  chatStore.addMessage(text.value);
  text.value = '';
}

function scrollToBottom() {
  const element = document.getElementById('chat-window');
  if (!element) return;
  element.scrollTop = element.scrollHeight;
}

watch(
  () => chatStore.chat?.messages,
  () => {
    //scrollToBottom();
  },
);
</script>
