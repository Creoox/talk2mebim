<template>
  <InputGroup>
    <InputText v-model="modelInputUrl" placeholder="Insert model url" />
    <Button icon="pi pi-arrow-circle-right" @click="openUrl" />
  </InputGroup>
</template>
<script setup lang="ts">
const modelInputUrl = ref('https://xeo.vision/project/7ec7c376-dfd2-40a5-8a9f-88a0f84025ae');
const { $trpc } = useNuxtApp();

const router = useRouter();

const openUrl = async() => {
  console.log('openUrl', { url: modelInputUrl });

  const response = await $trpc.chat.createOne.mutate({ xeoUrl: modelInputUrl.value });


  //router.push( { name: 'view', params: { id: response?.id }});
  router.push(`/view/${response?.id}`);
};
</script>
