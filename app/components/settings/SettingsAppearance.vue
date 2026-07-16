<template>
  <SettingsSectionCard
    title="Identidade visual"
    subtitle="Personalize as cores e a tipografia da página pública."
    icon="mdi-palette-outline"
    :loading="loading"
    @save="$emit('save')"
  >
    <div class="row q-col-gutter-lg">
      <div class="col-12 col-md-7">
        <div class="row q-col-gutter-x-md">
          <div class="col-12 col-sm-6">
            <label class="text-weight-medium text-subtitle2 q-mb-xs">
              Cor primária
            </label>
            <q-input
              v-model="model.primaryColor"
              outlined
              bg-color="grey-1"
              dense
              :rules="[(value) => Boolean(value) || 'Informe a cor primária']"
            >
              <template #prepend>
                <q-avatar
                  size="24px"
                  :style="{ backgroundColor: model.primaryColor }"
                />
              </template>
              <template #append>
                <q-icon name="mdi-eyedropper-variant" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-color v-model="model.primaryColor" no-header no-footer />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <div class="col-12 col-sm-6">
            <label class="text-weight-medium text-subtitle2 q-mb-xs">
              Cor secundária
            </label>
            <q-input
              v-model="model.secondaryColor"
              outlined
              bg-color="grey-1"
              dense
              :rules="[(value) => Boolean(value) || 'Informe a cor secundária']"
            >
              <template #prepend>
                <q-avatar
                  size="24px"
                  :style="{ backgroundColor: model.secondaryColor }"
                />
              </template>
              <template #append>
                <q-icon name="mdi-eyedropper-variant" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-color
                      v-model="model.secondaryColor"
                      no-header
                      no-footer
                    />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <div class="col-12">
            <label class="text-weight-medium text-subtitle2 q-mb-xs">
              Fonte da página
            </label>
            <q-select
              v-model="model.fontFamily"
              :options="fontOptions"
              outlined
              bg-color="grey-1"
              dense
              emit-value
              map-options
              dropdown-icon="mdi-chevron-down"
            />
          </div>
        </div>
      </div>

      <div class="col-12 col-md-5">
        <q-card flat bordered class="rounded-borders overflow-hidden">
          <q-toolbar
            class="text-white"
            :style="{ backgroundColor: model.primaryColor }"
          >
            <q-toolbar-title v-if="model.logoUrl">
              <q-img
                :src="model.logoUrl"
                :alt="`Logo de ${model.businessName}`"
                fit="contain"
                style="max-height: 40px; max-width: 120px"
              />
            </q-toolbar-title>
            <q-toolbar-title v-else class="text-white text-subtitle1">
              {{ model.businessName || "Seu negócio" }}
            </q-toolbar-title>

            <q-space v-if="model.logoUrl" />

            <div v-if="visibleChannels.length" class="row no-wrap">
              <q-btn
                v-for="channel in visibleChannels"
                :key="channel.type"
                :icon="channelIcons[channel.type]"
                flat
                round
                dense
              >
                <q-tooltip>{{ channel.value }}</q-tooltip>
              </q-btn>
            </div>
            <q-icon v-else name="mdi-link-variant-off" size="sm">
              <q-tooltip>Nenhum canal configurado</q-tooltip>
            </q-icon>
          </q-toolbar>

          <q-card-section
            class="bg-grey-1"
            :style="{ fontFamily: model.fontFamily }"
          >
            <div class="text-caption text-grey-7">Endereço de acesso</div>
            <div class="text-subtitle2">
              https://{{ model.slug || "seu-negocio" }}.roostec.com.br
            </div>
          </q-card-section>

          <q-separator />

          <q-card-section :style="{ fontFamily: model.fontFamily }">
            <div class="text-body2 text-grey-7 q-mb-md">
              Visualização dos elementos da sua página pública.
            </div>
            <q-btn
              label="Agendar horário"
              unelevated
              class="full-width"
              dense
              padding="sm md"
              no-caps
              text-color="white"
              :style="{ backgroundColor: model.secondaryColor }"
            />
          </q-card-section>
        </q-card>
      </div>
    </div>
  </SettingsSectionCard>
</template>

<script setup lang="ts">
import type {
  OnboardingChannelType,
  OnboardingOption,
} from "~/composables/useOnboarding";
import type { SettingsForm } from "~/composables/useSettings";
import SettingsSectionCard from "./SettingsSectionCard.vue";

defineProps<{ fontOptions: OnboardingOption[]; loading?: boolean }>();
defineEmits<{ save: [] }>();
const model = defineModel<SettingsForm>({ required: true });

const channelIcons: Record<OnboardingChannelType, string> = {
  whatsapp: "mdi-whatsapp",
  telegram: "mdi-send",
  instagram: "mdi-instagram",
  facebook: "mdi-facebook",
};

const visibleChannels = computed(() =>
  model.value.channels.filter(
    (channel): channel is typeof channel & { type: OnboardingChannelType } =>
      Boolean(channel.type && channel.value.trim()),
  ),
);
</script>
