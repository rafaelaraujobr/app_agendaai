<template>
  <q-layout
    view="hHh Lpr lff"
    container
    class="settings-shell"
  >
    <q-drawer
      v-model="settingsDrawer"
      show-if-above
      :width="260"
      :breakpoint="768"
      bordered
      :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-1'"
    >
      <q-scroll-area class="fit">
        <SettingsNavMenu
          :tab="tab"
          :inner-tab="innerTab"
          @select-company="selectCompanySection"
          @select-tab="selectTopTab"
        />
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <div class="settings-shell__content q-pa-md wrapper">
        <q-toolbar class="q-px-none q-mb-sm">
          <q-btn
            v-if="$q.screen.lt.md"
            flat
            dense
            round
            icon="menu"
            aria-label="Abrir menu de configurações"
            class="q-mr-sm"
            @click="settingsDrawer = true"
          />
          <q-toolbar-title>
            <div class="text-h5 text-weight-medium">{{ pageTitle }}</div>
            <div class="text-caption text-grey-7">{{ pageSubtitle }}</div>
          </q-toolbar-title>
        </q-toolbar>
        <slot />
      </div>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import type { SettingsSection } from "~/composables/useSettings";

const tab = defineModel<string>("tab", { required: true });
const innerTab = defineModel<string>("innerTab", { required: true });

const $q = useQuasar();
const settingsDrawer = ref(true);

const companySections: Array<{ name: SettingsSection; label: string }> = [
  { name: "profile", label: "Perfil" },
  { name: "access", label: "Link" },
  { name: "appearance", label: "Visual" },
  { name: "layout", label: "Página pública" },
  { name: "channels", label: "Canais" },
  { name: "address", label: "Localização" },
  { name: "hours", label: "Horários" },
];

const selectCompanySection = (section: SettingsSection) => {
  tab.value = "company";
  innerTab.value = section;
  if ($q.screen.lt.md) settingsDrawer.value = false;
};

const selectTopTab = (value: "profile" | "plans") => {
  tab.value = value;
  if ($q.screen.lt.md) settingsDrawer.value = false;
};

const pageTitle = computed(() => {
  if (tab.value === "profile") return "Meu perfil";
  if (tab.value === "plans") return "Planos e pagamentos";
  return (
    companySections.find((section) => section.name === innerTab.value)?.label ??
    "Empresa"
  );
});

const pageSubtitle = computed(() => {
  if (tab.value === "profile") {
    return "Preferências pessoais da sua conta.";
  }
  if (tab.value === "plans") {
    return "Consulte seu plano atual e histórico de pagamentos.";
  }
  return "Configurações do seu negócio.";
});
</script>

<style scoped lang="sass">
.settings-shell
  min-height: calc(100vh - 50px)

@media (min-width: 768px)
  .settings-shell
    left: 70px
    width: calc(100% - 70px)
</style>
