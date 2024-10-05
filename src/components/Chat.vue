<template>
  <div class="w-full h-full">
    <div class="overflow-y-scroll h-[calc(100%-70px)] p-3">
      <ChatMessage
        v-for="message of chatStore.chat?.messages"
        :key="message.id"
        :text="message.text"
        :who="message.who"
      />
    </div>

    <div class="flex items-center p-3 gap-2">
      <InputText v-model="text" type="text" placeholder="Type your prompt" class="w-full" />
      <Button class="w-20">Send</Button>
    </div>
  </div>
</template>

<script setup lang="ts">
const chatStore = useChatStore();
const text = ref('');
</script>
