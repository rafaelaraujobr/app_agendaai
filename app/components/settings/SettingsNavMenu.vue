<template>
  <nav class="settings-nav">
    <q-list padding class="q-gutter-y-sm" dense>
      <q-item class="q-mb-lg">
        <q-item-section avatar>
          <q-avatar
            color="primary-light"
            text-color="primary"
            icon="mdi-cog-outline"
            rounded
          />
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-weight-medium text-body1"
            >Empresa</q-item-label
          >
          <q-item-label caption lines="2"
            >Personalize sua negocio.</q-item-label
          >
        </q-item-section>
      </q-item>
      <q-item
        v-for="section in companySections"
        :key="section.name"
        v-ripple
        clickable
        :active="tab === 'company' && innerTab === section.name"
        active-class="active-item"
        @click="emit('select-company', section.name)"
        class="rounded-borders q-mx-sm"
        style="min-height: 38px"
      >
        <q-item-section avatar>
          <q-icon :name="section.icon" color="primary" />
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
  { name: "appearance", label: "Aparência", icon: "mdi-palette-outline" },
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

.active-item
  background-color: $primary-light
  &::before
    content: ''
    position: absolute
    left: 0
    top: 50%
    transform: translateY(-50%)
    width: 3px
    height: 25px
    background-color: $primary
</style>
