<template>
  <q-page class="bg-grey-1" style="min-height: calc(100vh - 72px)">
    <q-inner-loading
      :showing="status === 'pending'"
      label="Carregando informações da loja..."
      label-class="text-primary"
      color="primary"
    />

    <ShowcaseEmptyState
      v-if="status !== 'pending' && !business"
      :is-business-not-found="isBusinessNotFound"
      @retry="refresh"
    />

    <main v-else-if="business" class="wrapper q-px-md q-pb-xl">
      <ShowcaseCustomLayout
        :business="business"
        :primary-color="primaryColor"
        :secondary-color="secondaryColor"
        :sorted-working-hours="sortedWorkingHours"
        :formatted-address="formattedAddress"
        :google-maps-url="googleMapsUrl"
        :waze-maps-url="wazeMapsUrl"
        :has-coordinates="hasCoordinates"
        :map-center="mapCenter"
        :whatsapp-url="whatsappUrl"
        :get-service-whatsapp-url="getServiceWhatsappUrl"
      />

      <ShowcaseContact
        v-if="business.businessChannels.length"
        :channels="business.businessChannels"
        :primary-color="primaryColor"
      />
    </main>
  </q-page>
</template>

<script setup lang="ts">
import type { PublicBusiness } from "~/types/public-business";
import ShowcaseContact from "./ShowcaseContact.vue";
import ShowcaseCustomLayout from "./ShowcaseCustomLayout.vue";
import ShowcaseEmptyState from "./ShowcaseEmptyState.vue";
import { useShowcaseWhatsapp } from "~/composables/useShowcaseChannels";

const showcaseBusiness = useState<PublicBusiness | null>(
  "showcase-business",
  () => null,
);

const {
  business,
  status,
  refresh,
  isBusinessNotFound,
  primaryColor,
  secondaryColor,
  sortedWorkingHours,
  hasCoordinates,
  mapCenter,
  formattedAddress,
  googleMapsUrl,
  wazeMapsUrl,
} = usePublicBusiness();

const { whatsappUrl, getServiceWhatsappUrl } = useShowcaseWhatsapp(business);

useSeoMeta({
  title: () =>
    business.value
      ? `${business.value.name} | Agendamento online`
      : "Loja não encontrada",
  description: () =>
    business.value?.description ||
    (business.value
      ? `Conheça os serviços e agende seu horário com ${business.value.name}.`
      : "Página pública para agendamento online."),
  ogTitle: () => business.value?.name || "Agendamento online",
  ogDescription: () => business.value?.description || "",
  ogImage: () =>
    business.value?.bannerUrl || business.value?.logoUrl || undefined,
});

let stopWatchingBusiness: (() => void) | undefined;

onMounted(() => {
  showcaseBusiness.value = business.value;
  stopWatchingBusiness = watch(business, (value) => {
    showcaseBusiness.value = value;
  });
});

onBeforeUnmount(() => {
  stopWatchingBusiness?.();
  showcaseBusiness.value = null;
});
</script>
