<template>
  <InputGroup>
    <InputText v-model="modelInputUrl" placeholder="Insert model url" />
    <Button icon="pi pi-arrow-circle-right" @click="openUrl" />
  </InputGroup>
</template>
<script setup lang="ts">
const modelInputUrl = ref('https://xeovision.io/project/60ef6841-8d28-4575-bb6e-c5e88c1ad9ed');
const { $trpc } = useNuxtApp();

const router = useRouter();

const openUrl = async () => {
  const response = await $trpc.chat.createOne.mutate({ xeoUrl: modelInputUrl.value });
  router.push(`/view/${response?.id}`);
};
</script>
