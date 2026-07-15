<template>
  <OnboardingStepCard
    title="Logo do negócio"
    subtitle="Adicione uma imagem para representar sua marca."
    :animation-data="ImageAnimation"
  >
    <q-form ref="formRef" @submit.prevent="handleSubmit">
      <div class="q-mb-md">
        <label class="text-weight-medium text-subtitle2 q-mb-xs">
          Logotipo
        </label>
        <InputImageCrop v-model="logoFile" />
        <div class="text-caption text-grey-7">
          Prefira PNG ou SVG com fundo transparente..
        </div>
      </div>

      <q-banner v-if="logoError" rounded class="bg-red-1 text-negative">
        {{ logoError }}
      </q-banner>
    </q-form>

    <template #actions>
      <q-btn
        label="Voltar"
        unelevated
        no-caps
        dense
        padding="sm lg"
        color="primary"
        flat
        @click="$emit('previous')"
      />
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
import ImageAnimation from "~/assets/lotties/image.json";
import InputImageCrop from "~/components/common/InputImageCrop.vue";
import OnboardingStepCard from "./OnboardingStepCard.vue";

const emit = defineEmits<{
  next: [];
  previous: [];
}>();

const formRef = ref<QForm | null>(null);
const logoError = ref("");
const logoFile = defineModel<File | null>("logoFile", { required: true });

const handleSubmit = async () => {
  logoError.value = "";

  const isValid = await formRef.value?.validate();
  if (!isValid) return;

  if (!logoFile.value) {
    logoError.value = "Logotipo é obrigatório";
    return;
  }

  emit("next");
};
</script>
