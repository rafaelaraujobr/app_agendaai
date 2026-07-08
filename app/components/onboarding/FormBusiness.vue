<template>
  <OnboardingStepCard
    title="Dados do seu negócio"
    subtitle="Preencha os dados do seu negócio"
    :animation-data="BusinessAnimation"
  >
    <q-form ref="formRef" @submit.prevent="handleSubmit">
      <label class="text-weight-medium text-subtitle2 q-mb-xs">
        Área de atuação
      </label>
      <q-select
        v-model="businessType"
        outlined
        bg-color="grey-1"
        :options="businessTypes"
        map-options
        emit-value
        dropdown-icon="mdi-chevron-down"
        dense
        :rules="[
          (val) =>
            (val && val.length > 0) || 'Tipo de negócio é obrigatório',
        ]"
      />

      <label class="text-weight-medium text-subtitle2 q-mb-xs"> Nome </label>
      <q-input
        v-model="businessName"
        outlined
        bg-color="grey-1"
        type="text"
        placeholder="Ex: Barbearia do João"
        dense
        :rules="[
          (val) =>
            (val && val.length > 0) || 'Nome do seu negócio é obrigatório',
        ]"
      />

      <label class="text-weight-medium text-subtitle2 q-mb-xs"> Whatsapp </label>
      <q-input
        v-model="businessPhone"
        outlined
        bg-color="grey-1"
        type="tel"
        placeholder="Ex: +551234567890"
        dense
        mask="(##) #####-####"
        :rules="[
          (val) =>
            (val && val.length > 0) || 'Whatsapp do seu negócio é obrigatório',
        ]"
      />

      <label class="text-weight-medium text-subtitle2 q-mb-xs">
        Slug (URL amigável)
      </label>
      <q-input
        v-model="slug"
        outlined
        bg-color="grey-1"
        type="text"
        suffix=".roostec.com.br"
        class="prepend-custom"
        dense
        :rules="[
          (val) =>
            (val && val.length > 0) || 'Slug do seu negócio é obrigatório',
        ]"
      >
        <template #prepend>
          <span class="text-subtitle2">https://</span>
        </template>
      </q-input>

      <label class="text-weight-medium text-subtitle2 q-mb-xs">
        Breve descrição (opcional)
      </label>
      <q-card flat bordered class="bg-grey-1">
        <q-card-section class="q-pa-sm">
          <q-input
            v-model="businessDescription"
            bg-color="grey-1"
            borderless
            type="textarea"
            placeholder="Ex: Oferecemos cortes de cabelo e barba de alta qualidade"
            dense
            rows="3"
          />
        </q-card-section>
      </q-card>
    </q-form>

    <template #actions>
      <q-btn
        label="Avançar"
        unelevated
        no-caps
        dense
        padding="sm lg"
        color="primary"
        @click="handleSubmit"
      />
    </template>
  </OnboardingStepCard>
</template>

<script setup lang="ts">
import type { QForm } from "quasar";
import BusinessAnimation from "~/assets/lotties/maintenance_mode.json";
import type { OnboardingOption } from "~/composables/useOnboarding";
import OnboardingStepCard from "./OnboardingStepCard.vue";

defineProps<{
  businessTypes: OnboardingOption[];
}>();

const emit = defineEmits<{
  next: [];
}>();

const formRef = ref<QForm | null>(null);
const businessName = defineModel<string>("businessName", { required: true });
const businessType = defineModel<string>("businessType", { required: true });
const slug = defineModel<string>("slug", { required: true });
const businessPhone = defineModel<string>("businessPhone", { required: false });
const businessDescription = defineModel<string>("businessDescription", {
  required: true,
});

const handleSubmit = async () => {
  const isValid = await formRef.value?.validate();
  if (!isValid) return;

  emit("next");
};
</script>
