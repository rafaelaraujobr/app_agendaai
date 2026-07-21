<template>
  <q-layout view="hHh Lpr lff" container class="settings-shell">
    <q-drawer
      v-model="settingsDrawer"
      show-if-above
      :side="$q.screen.lt.md ? 'right' : 'left'"
      :width="$q.screen.lt.md ? 300 : 260"
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
          <q-toolbar-title>
            <q-item>
              <q-item-section side>
                <q-icon :name="pageIcon" size="md" color="primary" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ pageTitle }}</q-item-label>
                <q-item-label lines="1" class="text-subtitle2 text-grey-6">{{ pageSubtitle }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-toolbar-title>
          <q-btn
            v-if="$q.screen.lt.md"
            flat
            dense
            round
            icon="mdi-dots-vertical"
            aria-label="Abrir menu de configurações"
            class="q-mr-sm"
            @click="settingsDrawer = true"
          />
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

const companySections: Array<{
  name: SettingsSection;
  label: string;
  subtitle: string;
  icon: string;
}> = [
  {
    name: "profile",
    label: "Perfil",
    subtitle: "atualize as informações usadas para identificar seu negócio.",
    icon: "mdi-storefront-outline",
  },
  {
    name: "access",
    label: "Link",
    subtitle: "Defina o endereço usado pelos clientes para acessar sua página.",
    icon: "mdi-link-variant",
  },
  {
    name: "appearance",
    label: "Visual",
    subtitle: "Personalize as cores e a tipografia da página pública.",
    icon: "mdi-palette-outline",
  },
  {
    name: "layout",
    label: "Página pública",
    subtitle:
      "Defina quais cards aparecem e organize cada tipo de dispositivo.",
    icon: "mdi-view-dashboard-edit-outline",
  },
  {
    name: "channels",
    label: "Canais",
    subtitle: "Mantenha atualizados os canais usados pelos seus clientes.",
    icon: "mdi-message-text-outline",
  },
  {
    name: "address",
    label: "Localização",
    subtitle: "Atualize o endereço e ajuste a posição exata no mapa.",
    icon: "mdi-map-marker-outline",
  },
  {
    name: "hours",
    label: "Horários",
    subtitle: "Defina os dias, horários e intervalos do seu negócio.",
    icon: "mdi-clock-outline",
  },
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
  return (
    companySections.find((section) => section.name === innerTab.value)?.label ??
    "Empresa"
  );
});

const pageSubtitle = computed(() => {
  return (
    companySections.find((section) => section.name === innerTab.value)
      ?.subtitle ?? "Configurações do seu negócio."
  );
});

const pageIcon = computed(() => {
  return (
    companySections.find((section) => section.name === innerTab.value)?.icon ??
    "mdi-storefront-outline"
  );
});
</script>

<style scoped lang="sass">
.settings-shell
  min-height: calc(100vh - 50px)
</style>
