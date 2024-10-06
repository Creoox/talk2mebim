<template>
  <InputGroup>
    <InputText v-model="modelInputUrl" placeholder="Insert model url" />
    <Button icon="pi pi-arrow-circle-right" @click="openUrl" />
  </InputGroup>
</template>
<script setup lang="ts">
const modelInputUrl = ref('https://xeovision.io/project/c9a2f8f1-7105-4c04-9575-7f72333d6257');
const { $trpc } = useNuxtApp();

const router = useRouter();

const openUrl = async () => {
  const response = await $trpc.chat.createOne.mutate({ xeoUrl: modelInputUrl.value });
  router.push(`/view/${response?.id}`);
};
</script>
