<template>
  <q-page padding class="wrapper">
    <q-toolbar class="q-px-none q-mb-sm">
      <q-toolbar-title>
        <div class="text-h5 text-weight-medium">Configurações</div>
        <div class="text-caption text-grey-7">
          Gerencie seu negócio, perfil e assinatura.
        </div>
      </q-toolbar-title>
    </q-toolbar>

    <q-tabs
      v-model="tab"
      class="text-grey-8"
      active-color="primary"
      indicator-color="primary"
      align="left"
      no-caps
      outside-arrows
      mobile-arrows
    >
      <q-tab name="company" label="Empresa" />
      <q-tab name="profile" label="Meu perfil" />
      <q-tab name="plans" label="Planos e pagamentos" />
    </q-tabs>

    <q-separator />

    <q-inner-loading :showing="isLoading" label="Carregando configurações..." />

    <q-tab-panels v-if="!isLoading" v-model="tab" animated>
      <q-tab-panel name="company" class="q-pa-none q-pt-md">
        <q-splitter
          v-model="splitterModel"
          class="settings-splitter"
          :horizontal="$q.screen.lt.md"
          :disable="$q.screen.lt.md"
        >
          <template #before>
            <q-tabs
              v-model="innerTab"
              :vertical="$q.screen.gt.sm"
              no-caps
              inline-label
              align="left"
              active-color="primary"
              indicator-color="primary"
              outside-arrows
              mobile-arrows
              class="settings-nav-tabs"
            >
              <q-tab
                name="profile"
                label="Perfil"
                icon="mdi-storefront-outline"
              />
              <q-tab name="access" label="Link" icon="mdi-link-variant" />
              <q-tab
                name="appearance"
                label="Visual"
                icon="mdi-palette-outline"
              />
              <q-tab
                name="layout"
                label="Página pública"
                icon="mdi-view-dashboard-edit-outline"
              />
              <q-tab
                name="channels"
                label="Canais"
                icon="mdi-message-text-outline"
              />
              <q-tab
                name="address"
                label="Localização"
                icon="mdi-map-marker-outline"
              />
              <q-tab name="hours" label="Horários" icon="mdi-clock-outline" />
            </q-tabs>
          </template>

          <template #after>
            <q-tab-panels
              v-model="innerTab"
              animated
              class="bg-transparent"
            >
              <q-tab-panel name="profile" class="settings-panel">
                <SettingsBusinessProfile
                  v-model="form"
                  :business-types="businessTypes"
                  :loading="savingSection === 'profile'"
                  @save="saveSettings('profile')"
                />
              </q-tab-panel>

              <q-tab-panel name="access" class="settings-panel">
                <SettingsAccessLink
                  v-model="form"
                  :loading="savingSection === 'access'"
                  @save="saveSettings('access')"
                />
              </q-tab-panel>

              <q-tab-panel name="appearance" class="settings-panel">
                <SettingsAppearance
                  v-model="form"
                  :font-options="fontOptions"
                  :loading="savingSection === 'appearance'"
                  @save="saveSettings('appearance')"
                />
              </q-tab-panel>

              <q-tab-panel name="layout" class="settings-panel">
                <SettingsLayout
                  v-model="form"
                  :loading="savingSection === 'layout'"
                  @save="saveSettings('layout')"
                />
              </q-tab-panel>

              <q-tab-panel name="channels" class="settings-panel">
                <SettingsChannels
                  v-model="form"
                  :channel-options="channelOptions"
                  :loading="savingSection === 'channels'"
                  @save="saveSettings('channels')"
                />
              </q-tab-panel>

              <q-tab-panel name="address" class="settings-panel">
                <SettingsAddress
                  v-model="form"
                  :loading="savingSection === 'address'"
                  @save="saveSettings('address')"
                />
              </q-tab-panel>

              <q-tab-panel name="hours" class="settings-panel">
                <SettingsWorkingHours
                  v-model="form"
                  :loading="savingSection === 'hours'"
                  @save="saveSettings('hours')"
                />
              </q-tab-panel>
            </q-tab-panels>
          </template>
        </q-splitter>
      </q-tab-panel>

      <q-tab-panel name="profile">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-h6">Meu perfil</div>
            <div class="text-body2 text-grey-7">
              As configurações pessoais serão disponibilizadas nesta área.
            </div>
          </q-card-section>
        </q-card>
      </q-tab-panel>

      <q-tab-panel name="plans">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-h6">Planos e pagamentos</div>
            <div class="text-body2 text-grey-7">
              Consulte seu plano atual e histórico de pagamentos.
            </div>
          </q-card-section>
        </q-card>
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>
<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
});

const tab = ref("company");
const innerTab = ref("profile");
const splitterModel = ref(20);
const $q = useQuasar();
const {
  businessTypes,
  channelOptions,
  fontOptions,
  form,
  isLoading,
  loadSettings,
  saveSettings,
  savingSection,
} = useSettings();

watch(
  () => $q.screen.lt.md,
  (isMobile) => {
    splitterModel.value = isMobile ? 18 : 20;
  },
  { immediate: true },
);

onMounted(loadSettings);
</script>

<style scoped lang="sass">
.settings-splitter
  min-height: 680px

.settings-nav-tabs
  width: 100%

  :deep(.q-tab)
    justify-content: flex-start

  :deep(.q-tab__content)
    width: 100%
    justify-content: flex-start
    text-align: left

.settings-panel
  padding-top: 0
  padding-right: 0

@media (max-width: 1023px)
  .settings-splitter
    min-height: 820px

  .settings-panel
    padding: 16px 0 0
</style>
