<template>
  <section id="servicos" class="q-pt-lg">
    <ClientOnly>
      <GridLayout
        v-model:layout="renderedLayout"
        :col-num="columns"
        :row-height="60"
        :margin="[16, 16]"
        :is-draggable="false"
        :is-resizable="false"
        :vertical-compact="true"
        class="showcase-custom-layout"
      >
        <GridItem
          v-for="item in renderedLayout"
          :key="item.i"
          :i="item.i"
          :x="item.x"
          :y="item.y"
          :w="item.w"
          :h="item.h"
          :min-w="1"
          :min-h="2"
          :static="true"
        >
          <div class="full-height showcase-layout-card">
            <component
              :is="showcaseLayoutCardComponents[item.i]"
              :context="layoutContext"
            />
          </div>
        </GridItem>
      </GridLayout>

      <template #fallback>
        <div class="row q-col-gutter-md">
          <div v-for="index in 3" :key="index" class="col-12">
            <q-skeleton height="180px" square />
          </div>
        </div>
      </template>
    </ClientOnly>
  </section>
</template>

<script setup lang="ts">
import { GridItem, GridLayout } from "grid-layout-plus";
import type { PublicBusiness } from "~/types/public-business";
import type { ShowcaseLayoutContext } from "~/types/showcase-layout-context";
import {
  createDefaultShowcaseLayouts,
  showcaseDeviceColumns,
  type ShowcaseDevice,
  type ShowcaseLayoutItem,
} from "~/types/showcase-layout";
import { showcaseLayoutCardComponents } from "./layout-cards";

const props = defineProps<{
  business: PublicBusiness;
  primaryColor: string;
  secondaryColor: string;
  sortedWorkingHours: PublicBusiness["businessWorkingHours"];
  formattedAddress: string;
  googleMapsUrl: string;
  wazeMapsUrl: string;
  hasCoordinates: boolean;
  mapCenter: [number, number];
  whatsappUrl: string | null;
  getServiceWhatsappUrl: (serviceName: string) => string | null;
}>();

const $q = useQuasar();

const device = computed<ShowcaseDevice>(() => {
  if ($q.screen.lt.sm) return "mobile";
  if ($q.screen.lt.lg) return "tablet";
  return "desktop";
});

const columns = computed(() => showcaseDeviceColumns[device.value]);
const savedLayouts = computed(
  () => props.business.businessLayout?.settings?.showcaseLayouts,
);
const renderedLayout = ref<ShowcaseLayoutItem[]>([]);

const layoutContext = computed<ShowcaseLayoutContext>(() => ({
  business: props.business,
  primaryColor: props.primaryColor,
  secondaryColor: props.secondaryColor,
  sortedWorkingHours: props.sortedWorkingHours,
  formattedAddress: props.formattedAddress,
  googleMapsUrl: props.googleMapsUrl,
  wazeMapsUrl: props.wazeMapsUrl,
  hasCoordinates: props.hasCoordinates,
  mapCenter: props.mapCenter,
  whatsappUrl: props.whatsappUrl,
  getServiceWhatsappUrl: props.getServiceWhatsappUrl,
}));

const syncLayout = () => {
  const layout =
    savedLayouts.value?.[device.value] ??
    createDefaultShowcaseLayouts()[device.value];
  renderedLayout.value = layout.map((item) => ({ ...item }));
};

watch([device, savedLayouts], syncLayout, { immediate: true, deep: true });
</script>

<style scoped lang="sass">
.showcase-custom-layout
  min-height: 240px

:deep(.vgl-item:not(.vgl-item--placeholder))
  overflow: hidden
  border-radius: 12px

.showcase-layout-card
  overflow: auto
</style>
