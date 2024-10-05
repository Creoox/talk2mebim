<template>
  <InputGroup>
    <InputText v-model="modelInputUrl" placeholder="Insert model url" />
    <Button icon="pi pi-arrow-circle-right" @click="openUrl" />
  </InputGroup>
</template>
<script setup lang="ts">
const modelInputUrl = ref('https://xeovision.io/project/227c848e-ae98-473a-ab15-a0111fe548db');
const { $trpc } = useNuxtApp();

const router = useRouter();

const openUrl = async () => {
  const response = await $trpc.chat.createOne.mutate({ xeoUrl: modelInputUrl.value });
  router.push(`/view/${response?.id}`);
};
</script>
