<template>
  <q-card flat bordered class="full-height column flex-center text-grey-6">
    <q-icon name="mdi-eye-off-outline" size="40px" />
    <div class="text-caption q-mt-sm">{{ message }}</div>
  </q-card>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    message?: string;
  }>(),
  {
    message: "Conteúdo ainda não configurado",
  },
);
</script>
