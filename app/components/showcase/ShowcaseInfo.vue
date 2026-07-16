<template>
  <section class="q-pt-xl">
    <div class="row q-col-gutter-lg items-stretch">
      <div v-if="business.businessAddress" class="col-12 col-lg-7">
        <ShowcaseAddress
          :business-name="business.name"
          :primary-color="primaryColor"
          :formatted-address="formattedAddress"
          :google-maps-url="googleMapsUrl"
          :waze-maps-url="wazeMapsUrl"
          :has-coordinates="hasCoordinates"
          :map-center="mapCenter"
        />
      </div>

      <div
        v-if="business.businessWorkingHours.length"
        class="col-12"
        :class="business.businessAddress ? 'col-lg-5' : ''"
      >
        <ShowcaseWorkingHours
          :working-hours="sortedWorkingHours"
          :primary-color="primaryColor"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { PublicBusiness } from "~/types/public-business";
import ShowcaseAddress from "./ShowcaseAddress.vue";
import ShowcaseWorkingHours from "./ShowcaseWorkingHours.vue";

defineProps<{
  business: PublicBusiness;
  primaryColor: string;
  sortedWorkingHours: PublicBusiness["businessWorkingHours"];
  formattedAddress: string;
  googleMapsUrl: string;
  wazeMapsUrl: string;
  hasCoordinates: boolean;
  mapCenter: [number, number];
}>();
</script>
