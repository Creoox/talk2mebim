<template>
  <InputGroup>
    <InputText v-model="modelInputUrl" placeholder="Insert model url" />
    <Button icon="pi pi-arrow-circle-right" @click="openUrl" />
  </InputGroup>
</template>
<script setup lang="ts">
const modelInputUrl = ref('https://xeovision.io/project/aacd1c5f-5af8-4681-9c3c-8d938680042c');
const { $trpc } = useNuxtApp();

const router = useRouter();

const openUrl = async () => {
  const response = await $trpc.chat.createOne.mutate({ xeoUrl: modelInputUrl.value });
  router.push(`/view/${response?.id}`);
};
</script>
