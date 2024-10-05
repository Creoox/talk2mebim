<script setup lang="ts">
const { $trpc } = useNuxtApp();

const createdChat = await $trpc.chat.createOne.mutate();

const msg = await $trpc.chat.addMessage.mutate({
  chatId: createdChat.id,
  text: 'Hello, World!',
  who: 'user',
});

const { execute, data } = await $trpc.chat.getOne.useQuery({ id: createdChat.id });
useIntervalFn(execute, 1000);
</script>

<template>
  <div>
    {{ data }}
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </div>
</template>
