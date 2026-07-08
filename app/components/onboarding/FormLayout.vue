<template>
  <OnboardingStepCard
    title="Identidade visual"
    subtitle="Escolha as cores e a fonte da sua página pública."
    :animation-data="LayoutAnimation"
  >
    <q-form ref="formRef" @submit.prevent="handleSubmit">
      <div class="row q-col-gutter-md">
        <div class="col-6">
          <label class="text-weight-medium text-subtitle2 q-mb-xs">
            Cor primária
          </label>
          <q-input
            v-model="primaryColor"
            outlined
            bg-color="grey-1"
            type="text"
            dense
            :rules="[
              (val) => (val && val.length > 0) || 'Cor primária é obrigatória',
            ]"
          />
        </div>

        <div class="col-6">
          <label class="text-weight-medium text-subtitle2 q-mb-xs">
            Cor secundária
          </label>
          <q-input
            v-model="secondaryColor"
            outlined
            bg-color="grey-1"
            type="text"
            dense
            :rules="[
              (val) =>
                (val && val.length > 0) || 'Cor secundária é obrigatória',
            ]"
          />
        </div>

        <div class="col-12">
          <label class="text-weight-medium text-subtitle2 q-mb-xs">
            Fonte da página
          </label>
          <q-select
            v-model="fontFamily"
            outlined
            bg-color="grey-1"
            :options="fontOptions"
            map-options
            emit-value
            dropdown-icon="mdi-chevron-down"
            dense
            :rules="[
              (val) => (val && val.length > 0) || 'Fonte é obrigatória',
            ]"
          />
        </div>
      </div>
    </q-form>

    <template #actions>
      <q-btn
        label="Voltar"
        unelevated
        no-caps
        dense
        padding="sm lg"
        flat
        color="primary"
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
import LayoutAnimation from "~/assets/lotties/develope.json";
import type { OnboardingOption } from "~/composables/useOnboarding";
import OnboardingStepCard from "./OnboardingStepCard.vue";

defineProps<{
  fontOptions: OnboardingOption[];
}>();

const emit = defineEmits<{
  next: [];
  previous: [];
}>();

const formRef = ref<QForm | null>(null);
const primaryColor = defineModel<string>("primaryColor", { required: true });
const secondaryColor = defineModel<string>("secondaryColor", {
  required: true,
});
const fontFamily = defineModel<string>("fontFamily", { required: true });

const handleSubmit = async () => {
  const isValid = await formRef.value?.validate();
  if (!isValid) return;

  emit("next");
};
</script>

<style lang="sass" scoped>
.preview-card
  background: linear-gradient(135deg, #ffffff 0%, #f7f7f7 100%)
</style>
