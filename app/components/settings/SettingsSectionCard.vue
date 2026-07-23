<template>
  <q-card flat>
    <q-separator />
    <q-card-section class="q-pa-sm">
      <slot />
    </q-card-section>
    <q-separator />
    <q-card-actions align="right" class="q-pa-md">
      <q-btn
        :label="saveLabel"
        color="secondary"
        dense
        padding="sm md"
        unelevated
        no-caps
        :loading="loading"
        :disable="loading"
        @click="$emit('save')"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string;
    subtitle: string;
    icon: string;
    loading?: boolean;
    saveLabel?: string;
  }>(),
  {
    loading: false,
    saveLabel: "Salvar alterações",
  },
);

defineEmits<{ save: [] }>();
</script>
