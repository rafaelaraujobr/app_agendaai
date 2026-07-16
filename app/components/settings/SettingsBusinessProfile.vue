<template>
  <SettingsSectionCard
    title="Perfil do negócio"
    subtitle="Atualize as informações usadas para identificar seu negócio."
    icon="mdi-storefront-outline"
    :loading="loading"
    @save="$emit('save')"
  >
    <q-form class="row q-col-gutter-lg">
      <div class="col-12 col-md-4">
        <label class="text-weight-medium text-subtitle2 q-mb-xs">
          Logotipo
        </label>
        <q-banner
          v-if="model.logoUrl && !model.logoFile"
          rounded
          class="bg-grey-1 q-mb-md"
        >
          <template #avatar>
            <q-avatar size="56px" color="white" text-color="primary">
              <q-img :src="model.logoUrl" :ratio="1" fit="contain" />
            </q-avatar>
          </template>
          <div class="text-weight-medium">Logo atual</div>
          <div class="text-caption text-grey-7">
            Selecione uma nova imagem abaixo somente se desejar substituí-la.
          </div>
        </q-banner>
        <InputImageCrop v-model="model.logoFile" />
        <div class="text-caption text-grey-7">
          Prefira PNG ou SVG com fundo transparente.
        </div>
      </div>

      <div class="col-12 col-md-8">
        <div class="row q-col-gutter-x-md">
          <div class="col-12 col-sm-6">
            <label class="text-weight-medium text-subtitle2 q-mb-xs">
              Área de atuação
            </label>
            <q-select
              v-model="model.businessType"
              :options="businessTypes"
              outlined
              bg-color="grey-1"
              dense
              emit-value
              map-options
              dropdown-icon="mdi-chevron-down"
              :rules="[
                (value) => Boolean(value) || 'Selecione a área de atuação',
              ]"
            />
          </div>
          <div class="col-12 col-sm-6">
            <label class="text-weight-medium text-subtitle2 q-mb-xs">
              Nome do negócio
            </label>
            <q-input
              v-model="model.businessName"
              outlined
              bg-color="grey-1"
              dense
              maxlength="150"
              :rules="[
                (value) =>
                  String(value ?? '').trim().length >= 2 ||
                  'Informe o nome do negócio',
              ]"
            />
          </div>
          <div class="col-12">
            <label class="text-weight-medium text-subtitle2 q-mb-xs">
              WhatsApp
            </label>
            <q-input
              v-model="model.businessPhone"
              outlined
              bg-color="grey-1"
              dense
              type="tel"
              mask="(##) #####-####"
              :rules="[(value) => Boolean(value) || 'Informe o WhatsApp']"
            >
              <template #prepend>
                <q-icon name="mdi-whatsapp" color="positive" />
              </template>
            </q-input>
          </div>
          <div class="col-12">
            <label class="text-weight-medium text-subtitle2 q-mb-xs">
              Descrição
            </label>
            <q-card flat class="bg-grey-1" bordered>
              <q-card-section class="q-px-sm q-pt-none">
                <q-input
                  v-model="model.businessDescription"
                  borderless
                  type="textarea"
                  rows="3"
                  maxlength="240"
                  placeholder="Ex: Oferecemos cortes de cabelo e barba de alta qualidade"
                  counter
                />
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </q-form>
  </SettingsSectionCard>
</template>

<script setup lang="ts">
import InputImageCrop from "~/components/common/InputImageCrop.vue";
import type { OnboardingOption } from "~/composables/useOnboarding";
import type { SettingsForm } from "~/composables/useSettings";
import SettingsSectionCard from "./SettingsSectionCard.vue";

defineProps<{
  businessTypes: OnboardingOption[];
  loading?: boolean;
}>();

defineEmits<{ save: [] }>();
const model = defineModel<SettingsForm>({ required: true });
</script>
