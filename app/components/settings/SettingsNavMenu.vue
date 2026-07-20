<template>
  <nav class="settings-nav">
    <q-list padding>
      <q-item-label header class="text-grey-7">Empresa</q-item-label>
      <q-item
        v-for="section in companySections"
        :key="section.name"
        v-ripple
        clickable
        :active="tab === 'company' && innerTab === section.name"
        active-class="bg-primary text-white"
        @click="emit('select-company', section.name)"
      >
        <q-item-section avatar>
          <q-icon :name="section.icon" />
        </q-item-section>
        <q-item-section>{{ section.label }}</q-item-section>
      </q-item>
    </q-list>
  </nav>
</template>

<script setup lang="ts">
import type { SettingsSection } from "~/composables/useSettings";

defineProps<{
  tab: string;
  innerTab: string;
}>();

const emit = defineEmits<{
  "select-company": [section: SettingsSection];
  "select-tab": [tab: "profile" | "plans"];
}>();

const companySections: Array<{
  name: SettingsSection;
  label: string;
  icon: string;
}> = [
  { name: "profile", label: "Perfil", icon: "mdi-storefront-outline" },
  { name: "access", label: "Link", icon: "mdi-link-variant" },
  { name: "appearance", label: "Visual", icon: "mdi-palette-outline" },
  {
    name: "layout",
    label: "Página pública",
    icon: "mdi-view-dashboard-edit-outline",
  },
  { name: "channels", label: "Canais", icon: "mdi-message-text-outline" },
  { name: "address", label: "Localização", icon: "mdi-map-marker-outline" },
  { name: "hours", label: "Horários", icon: "mdi-clock-outline" },
];
</script>

<style scoped lang="sass">
.settings-nav
  width: 100%

:deep(.q-item__section--avatar)
  min-width: 32px
</style>
