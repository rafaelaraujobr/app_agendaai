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
        :loading="loadingBusinessTypes"
        :disable="loadingBusinessTypes || businessTypes.length === 0"
        map-options
        emit-value
        dropdown-icon="mdi-chevron-down"
        dense
        :rules="[
          (val) => (val && val.length > 0) || 'Tipo de negócio é obrigatório',
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

      <label class="text-weight-medium text-subtitle2 q-mb-xs">
        Whatsapp
      </label>
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
        :model-value="slug"
        outlined
        bg-color="grey-1"
        type="text"
        suffix=".roostec.com.br"
        class="prepend-custom"
        dense
        :loading="slugStatus === 'checking'"
        :error="slugStatus === 'unavailable' || slugStatus === 'error'"
        :error-message="slugMessage"
        :hint="slugStatus === 'available' ? slugMessage : undefined"
        :rules="[
          (val) =>
            (val && val.length > 0) || 'Slug do seu negócio é obrigatório',
          (val) =>
            String(val ?? '').length >= 2 ||
            'O slug deve ter pelo menos 2 caracteres',
          (val) =>
            /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(String(val ?? '')) ||
            'Use apenas letras minúsculas, números e hífens',
        ]"
        @update:model-value="updateSlug"
      >
        <template #prepend>
          <span class="text-subtitle2">https://</span>
        </template>
      </q-input>

      <!-- <label class="text-weight-medium text-subtitle2 q-mb-xs">
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
      </q-card> -->
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
        :loading="slugStatus === 'checking'"
        :disable="slugStatus === 'unavailable'"
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

const props = defineProps<{
  businessTypes: OnboardingOption[];
  loadingBusinessTypes?: boolean;
  checkSlugAvailability: (slug: string) => Promise<boolean>;
}>();

const emit = defineEmits<{
  next: [];
  previous: [];
}>();

const formRef = ref<QForm | null>(null);
const businessName = defineModel<string>("businessName", { required: true });
const businessType = defineModel<string>("businessType", { required: true });
const slug = defineModel<string>("slug", { required: true });
const businessPhone = defineModel<string>("businessPhone", { required: false });
const businessDescription = defineModel<string>("businessDescription", {
  required: true,
});
const hasCustomSlug = ref(false);
const slugStatus = ref<
  "idle" | "checking" | "available" | "unavailable" | "error"
>("idle");
const slugMessage = ref("");

const normalizeSlug = (value: string) => {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);
};

const isValidSlug = (value: string) =>
  value.length >= 2 &&
  value.length <= 100 &&
  /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);

const resetSlugStatus = () => {
  slugStatus.value = "idle";
  slugMessage.value = "";
};

const checkSlugAvailability = async (value: string) => {
  if (!isValidSlug(value)) {
    resetSlugStatus();
    return false;
  }

  slugStatus.value = "checking";
  slugMessage.value = "Verificando disponibilidade...";

  try {
    const isAvailable = await props.checkSlugAvailability(value);

    slugStatus.value = isAvailable ? "available" : "unavailable";
    slugMessage.value = isAvailable
      ? "Este endereço está disponível"
      : "Este endereço já está em uso";
    return isAvailable;
  } catch {
    slugStatus.value = "error";
    slugMessage.value = "Não foi possível verificar o endereço";
    return false;
  }
};

const updateSlug = (value: string | number | null) => {
  hasCustomSlug.value = true;
  slug.value = normalizeSlug(String(value ?? ""));
  resetSlugStatus();
};

watch(businessName, (value) => {
  if (hasCustomSlug.value) return;

  slug.value = normalizeSlug(value);
  resetSlugStatus();
});

const handleSubmit = async () => {
  const isValid = await formRef.value?.validate();
  if (!isValid) return;

  const isSlugAvailable = await checkSlugAvailability(slug.value);
  if (!isSlugAvailable) return;

  emit("next");
};
</script>
