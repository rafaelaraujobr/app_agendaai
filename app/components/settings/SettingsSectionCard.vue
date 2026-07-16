<template>
  <q-card flat bordered class="rounded-borders">
    <q-card-section class="row items-center no-wrap q-col-gutter-md">
      <div class="col-auto">
        <q-icon :name="icon" size="md" color="primary" />
      </div>
      <div class="col">
        <div class="text-h6">{{ title }}</div>
        <div class="text-body2 text-grey-7">{{ subtitle }}</div>
      </div>
    </q-card-section>
    <q-separator />
    <q-card-section>
      <slot />
    </q-card-section>
    <q-separator />
    <q-card-actions align="right" class="q-pa-md">
      <q-btn
        :label="saveLabel"
        color="primary"
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
