<script setup lang="ts">
const { $trpc } = useNuxtApp();

const createdChat = await $trpc.chats.createOne.mutate();

const msg = await $trpc.chats.addMessage.mutate({
  chatId: createdChat.id,
  text: 'Hello, World!',
  who: 'user',
});

const chat = await $trpc.chats.getOne.query({ id: createdChat.id });
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </div>
</template>
