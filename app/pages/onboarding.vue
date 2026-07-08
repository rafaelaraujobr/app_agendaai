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
          v-model:business-type="businessType"
          v-model:slug="slug"
          v-model:business-description="businessDescription"
          :business-types="businessTypes"
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

      <q-step :name="3" title="business-layout" :done="step > 3">
        <FormLayout
          v-model:primary-color="primaryColor"
          v-model:secondary-color="secondaryColor"
          v-model:font-family="fontFamily"
          :font-options="fontOptions"
          @previous="goToPreviousStep"
          @next="goToNextStep"
        />
      </q-step>

      <q-step :name="4" title="business-channels" :done="step > 4">
        <FormChannels
          v-model:channels="channelSelected"
          :channel-options="channelOptions"
          @previous="goToPreviousStep"
          @next="goToNextStep"
        />
      </q-step>

      <q-step :name="5" title="business-address" :done="step > 5">
        <FormAddress
          v-model:address="address"
          v-model:not-have-number="notHaveNumber"
          @previous="goToPreviousStep"
          @next="goToNextStep"
        />
      </q-step>

      <q-step :name="6" title="business-working-hours" :done="step > 6">
        <FormWorkingHours
          v-model:working-hours="workingHours"
          @previous="goToPreviousStep"
          @next="goToNextStep"
        />
      </q-step>

      <q-step :name="7" title="business-review" :done="step > 7">
        <FormReview
          :payload="createBusinessPayload"
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
import FormLayout from "~/components/onboarding/FormLayout.vue";
import FormReview from "~/components/onboarding/FormReview.vue";
import FormWorkingHours from "~/components/onboarding/FormWorkingHours.vue";

definePageMeta({
  layout: "auth",
  middleware: ["auth"],
});

const step = ref(1);
const stepperRef = ref<InstanceType<typeof QStepper>>();

const {
  address,
  businessDescription,
  businessName,
  businessType,
  businessTypes,
  channelOptions,
  channelSelected,
  createBusinessPayload,
  fontFamily,
  fontOptions,
  logoFile,
  notHaveNumber,
  primaryColor,
  secondaryColor,
  slug,
  workingHours,
} = useOnboarding();

const goToNextStep = () => {
  stepperRef.value?.next();
};

const goToPreviousStep = () => {
  stepperRef.value?.previous();
};

const handleCreateBusiness = () => {
  console.log("createBusinessPayload", createBusinessPayload.value);
};
</script>

<style lang="sass" scoped>
:deep(.q-stepper__header)
  display: none
</style>
