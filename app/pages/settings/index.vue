<template>
  <SettingsShell v-model:tab="tab" v-model:inner-tab="innerTab">
    <q-inner-loading
      :showing="isLoading"
      label="Carregando configurações..."
    />

    <template v-if="!isLoading">
      <template v-if="tab === 'company'">
        <SettingsBusinessProfile
          v-if="innerTab === 'profile'"
          v-model="form"
          :business-types="businessTypes"
          :loading="savingSection === 'profile'"
          @save="saveSettings('profile')"
        />

        <SettingsAccessLink
          v-else-if="innerTab === 'access'"
          v-model="form"
          :loading="savingSection === 'access'"
          @save="saveSettings('access')"
        />

        <SettingsAppearance
          v-else-if="innerTab === 'appearance'"
          v-model="form"
          :font-options="fontOptions"
          :loading="savingSection === 'appearance'"
          @save="saveSettings('appearance')"
        />

        <SettingsLayout
          v-else-if="innerTab === 'layout'"
          v-model="form"
          :loading="savingSection === 'layout'"
          @save="saveSettings('layout')"
        />

        <SettingsChannels
          v-else-if="innerTab === 'channels'"
          v-model="form"
          :channel-options="channelOptions"
          :loading="savingSection === 'channels'"
          @save="saveSettings('channels')"
        />

        <SettingsAddress
          v-else-if="innerTab === 'address'"
          v-model="form"
          :loading="savingSection === 'address'"
          @save="saveSettings('address')"
        />

        <SettingsWorkingHours
          v-else-if="innerTab === 'hours'"
          v-model="form"
          :loading="savingSection === 'hours'"
          @save="saveSettings('hours')"
        />
      </template>

      <q-card v-else-if="tab === 'profile'" flat bordered>
        <q-card-section>
          <div class="text-h6">Meu perfil</div>
          <div class="text-body2 text-grey-7">
            As configurações pessoais serão disponibilizadas nesta área.
          </div>
        </q-card-section>
      </q-card>

      <q-card v-else-if="tab === 'plans'" flat bordered>
        <q-card-section>
          <div class="text-h6">Planos e pagamentos</div>
          <div class="text-body2 text-grey-7">
            Consulte seu plano atual e histórico de pagamentos.
          </div>
        </q-card-section>
      </q-card>
    </template>
  </SettingsShell>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
});

const tab = ref("company");
const innerTab = ref("profile");

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

onMounted(loadSettings);
</script>
