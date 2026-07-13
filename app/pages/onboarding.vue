<template>
  <q-page class="flex flex-center bg-grey-1">
    <q-stepper
      ref="stepperRef"
      v-model="step"
      contracted
      color="primary"
      flat
      animated
    >
      <q-step :name="1" title="business-data" :done="step > 1">
        <FormBusiness
          v-model:business-name="businessName"
          v-model:business-phone="businessPhone"
          v-model:business-type="businessType"
          v-model:slug="slug"
          v-model:business-description="businessDescription"
          :business-types="businessTypes"
          :loading-business-types="isLoadingBusinessTypes"
          :check-slug-availability="checkSlugAvailability"
          @next="goToNextStep"
        />
      </q-step>

      <q-step :name="2" title="business-images" :done="step > 2">
        <FormImages
          v-model:logo-file="logoFile"
          @previous="goToPreviousStep"
          @next="goToNextStep"
        />
      </q-step>

      <!-- <q-step :name="3" title="business-layout" :done="step > 3">
        <FormLayout
          v-model:primary-color="primaryColor"
          v-model:secondary-color="secondaryColor"
          v-model:font-family="fontFamily"
          :font-options="fontOptions"
          @previous="goToPreviousStep"
          @next="goToNextStep"
        />
      </q-step> -->

      <q-step :name="3" title="business-channels" :done="step > 3">
        <FormChannels
          v-model:channels="channelSelected"
          :channel-options="channelOptions"
          @previous="goToPreviousStep"
          @next="goToNextStep"
        />
      </q-step>

      <q-step :name="4" title="business-address" :done="step > 4">
        <FormAddress
          v-model:address="address"
          v-model:not-have-number="notHaveNumber"
          @previous="goToPreviousStep"
          @next="goToNextStep"
        />
      </q-step>

      <q-step :name="5" title="business-working-hours" :done="step > 5">
        <FormWorkingHours
          v-model:working-hours="workingHours"
          @previous="goToPreviousStep"
          @next="goToNextStep"
        />
      </q-step>

      <q-step :name="6" title="business-review" :done="step > 6">
        <FormReview
          :payload="createBusinessPayload"
          :loading="isCreating"
          @previous="goToPreviousStep"
          @submit="handleCreateBusiness"
        />
      </q-step>
    </q-stepper>
  </q-page>
</template>

<script setup lang="ts">
import type { QStepper } from "quasar";
import FormAddress from "~/components/onboarding/FormAddress.vue";
import FormBusiness from "~/components/onboarding/FormBusiness.vue";
import FormChannels from "~/components/onboarding/FormChannels.vue";
import FormImages from "~/components/onboarding/FormImages.vue";
// import FormLayout from "~/components/onboarding/FormLayout.vue";
import FormReview from "~/components/onboarding/FormReview.vue";
import FormWorkingHours from "~/components/onboarding/FormWorkingHours.vue";

definePageMeta({
  layout: "auth",
  middleware: ["auth"],
});

type ApiError = {
  data?: {
    statusCode?: number;
    statusMessage?: string;
    message?: string;
  };
  statusCode?: number;
  statusMessage?: string;
  message?: string;
};

const step = ref(1);
const stepperRef = ref<InstanceType<typeof QStepper>>();
const $q = useQuasar();
const { fetch: refreshSession } = useUserSession();

const {
  address,
  businessDescription,
  businessName,
  businessPhone,
  businessType,
  businessTypes,
  channelOptions,
  channelSelected,
  checkSlugAvailability,
  createBusiness,
  createBusinessPayload,
  // fontFamily,
  // fontOptions,
  logoFile,
  notHaveNumber,
  // primaryColor,
  // secondaryColor,
  slug,
  isCreating,
  isLoadingBusinessTypes,
  loadBusinessTypes,
  workingHours,
} = useOnboarding();

onMounted(async () => {
  try {
    await loadBusinessTypes();
  } catch (error) {
    $q.notify({
      type: "negative",
      message: getErrorMessage(error),
    });
  }
});

const goToNextStep = () => {
  stepperRef.value?.next();
};

const goToPreviousStep = () => {
  stepperRef.value?.previous();
};

const getErrorMessage = (error: unknown) => {
  const apiError = error as ApiError;
  const statusCode = apiError.data?.statusCode ?? apiError.statusCode;

  if (statusCode === 409) {
    return "Este endereço acabou de ser utilizado. Volte e escolha outro slug.";
  }

  return (
    apiError.data?.statusMessage ??
    apiError.data?.message ??
    apiError.statusMessage ??
    apiError.message ??
    "Não foi possível criar o negócio"
  );
};

const handleCreateBusiness = async () => {
  try {
    await createBusiness();
    await refreshSession();

    $q.notify({
      type: "positive",
      message: "Negócio criado com sucesso",
    });
    await navigateTo("/", { replace: true });
  } catch (error) {
    const onboardingError = error as ApiError & { step?: number };
    if (onboardingError.step) {
      step.value = onboardingError.step;
    }

    $q.notify({
      type: "negative",
      message: getErrorMessage(error),
    });
  }
};
</script>

<style lang="sass" scoped>
:deep(.q-stepper__header)
  display: none
</style>
