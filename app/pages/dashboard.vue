<template>
  <q-page padding class="wrapper">
    <Panel />
  </q-page>
</template>
<script setup lang="ts">
import Panel from '@/components/dashboard/Panel.vue';

definePageMeta({
  middleware: ["auth"],
});
</script>

<style scoped lang="sass">
</style>
