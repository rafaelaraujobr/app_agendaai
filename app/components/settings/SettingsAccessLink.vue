<template>
  <SettingsSectionCard
    title="Link de acesso"
    subtitle="Defina o endereço usado pelos clientes para acessar sua página."
    icon="mdi-link-variant"
    :loading="loading"
    @save="$emit('save')"
  >
    <q-label class="text-weight-medium text-subtitle2 q-mb-xs">
      Endereço público(slug)
    </q-label>
    <q-input
      :model-value="model.slug"
      outlined
      bg-color="grey-1"
      dense
      maxlength="100"
      suffix=".roostec.com.br"
      :rules="slugRules"
      @update:model-value="updateSlug"
    >
      <template #prepend>
        <span class="text-body2">https://</span>
      </template>
    </q-input>
    <q-banner rounded class="bg-grey-1 text-grey-8 q-mt-lg">
      <template #avatar>
        <q-icon name="mdi-information-outline" />
      </template>
      Alterar este endereço fará com que o link anterior deixe de funcionar.
    </q-banner>
  </SettingsSectionCard>
</template>

<script setup lang="ts">
import type { SettingsForm } from "~/composables/useSettings";
import SettingsSectionCard from "./SettingsSectionCard.vue";

defineProps<{ loading?: boolean }>();
defineEmits<{ save: [] }>();
const model = defineModel<SettingsForm>({ required: true });

const slugRules = [
  (value: string) => value.length >= 2 || "Use pelo menos 2 caracteres",
  (value: string) =>
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) ||
    "Use apenas letras minúsculas, números e hífens",
];

const updateSlug = (value: string | number | null) => {
  model.value.slug = String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);
};
</script>
