<template>
  <footer class="bg-white text-center text-grey-7">
    <div class="wrapper q-px-md">
      <q-separator />
      <div class="q-py-lg">
        © {{ currentYear }} {{ businessName }}. Todos os direitos reservados.
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
defineProps<{
  businessName: string;
}>();

const currentYear = new Date().getFullYear();
</script>
