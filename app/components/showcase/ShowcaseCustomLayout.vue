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
            <ShowcaseAddress
              v-if="item.i === 'address' && business.businessAddress"
              :business-name="business.name"
              :primary-color="primaryColor"
              :formatted-address="formattedAddress"
              :google-maps-url="googleMapsUrl"
              :waze-maps-url="wazeMapsUrl"
              :has-coordinates="hasCoordinates"
              :map-center="mapCenter"
            />

            <ShowcaseWorkingHours
              v-else-if="
                item.i === 'working-hours' &&
                business.businessWorkingHours.length
              "
              :working-hours="sortedWorkingHours"
              :primary-color="primaryColor"
            />

            <q-card
              v-else-if="item.i === 'banner'"
              flat
              bordered
              class="full-height overflow-hidden"
            >
              <q-img
                v-if="business.bannerUrl"
                :src="business.bannerUrl"
                :alt="`Banner de ${business.name}`"
                fit="cover"
                class="full-height"
              >
                <div class="absolute-bottom text-h5 text-weight-bold">
                  {{ business.name }}
                </div>
              </q-img>
              <div
                v-else
                class="full-height column flex-center text-center q-pa-lg text-white"
                :style="bannerStyle"
              >
                <q-avatar
                  v-if="business.logoUrl"
                  size="72px"
                  class="bg-white q-mb-md"
                >
                  <q-img :src="business.logoUrl" :alt="business.name" />
                </q-avatar>
                <q-icon v-else name="mdi-storefront-outline" size="56px" />
                <div class="text-h5 text-weight-bold q-mt-sm">
                  {{ business.name }}
                </div>
                <div v-if="business.description" class="text-body2 q-mt-xs">
                  {{ business.description }}
                </div>
              </div>
            </q-card>

            <q-card
              v-else-if="item.i === 'promotions'"
              flat
              bordered
              class="full-height overflow-hidden"
            >
              <q-carousel
                v-model="promotionSlide"
                animated
                swipeable
                infinite
                :autoplay="5000"
                arrows
                navigation
                class="full-height"
              >
                <q-carousel-slide
                  v-if="!promotionHighlights.length"
                  name="welcome"
                  class="column flex-center text-center"
                  :style="{ color: primaryColor }"
                >
                  <q-icon name="mdi-sale-outline" size="56px" />
                  <div class="text-h6 text-weight-bold q-mt-sm">
                    Novidades em breve
                  </div>
                </q-carousel-slide>
                <q-carousel-slide
                  v-for="highlight in promotionHighlights"
                  :key="highlight.id"
                  :name="highlight.id"
                  class="q-pa-none"
                >
                  <q-img
                    v-if="getHighlightImage(highlight)"
                    :src="getHighlightImage(highlight)!"
                    :alt="highlight.title"
                    fit="cover"
                    class="full-height"
                  >
                    <div class="absolute-bottom">
                      <div class="text-h6 text-weight-bold">
                        {{ highlight.title }}
                      </div>
                      <div v-if="highlight.description">
                        {{ highlight.description }}
                      </div>
                      <div>
                        {{ formatShowcaseCurrency(highlight.service.price) }}
                      </div>
                      <q-btn
                        v-if="getServiceWhatsappUrl(highlight.service.name)"
                        label="Agendar"
                        dense
                        no-caps
                        unelevated
                        color="primary"
                        class="q-mt-sm"
                        :href="
                          getServiceWhatsappUrl(highlight.service.name) ||
                          undefined
                        "
                        target="_blank"
                      />
                    </div>
                  </q-img>
                  <div
                    v-else
                    class="full-height column flex-center text-center q-pa-lg"
                    :style="{ color: primaryColor }"
                  >
                    <q-icon name="mdi-star-circle-outline" size="56px" />
                    <div class="text-h6 text-weight-bold q-mt-sm">
                      {{ highlight.title }}
                    </div>
                    <div v-if="highlight.description">
                      {{ highlight.description }}
                    </div>
                    <div>
                      {{ formatShowcaseCurrency(highlight.service.price) }}
                    </div>
                  </div>
                </q-carousel-slide>
              </q-carousel>
            </q-card>

            <q-card
              v-else-if="item.i === 'featured-services'"
              flat
              bordered
              class="full-height column"
            >
              <q-card-section>
                <div class="text-h6 text-weight-bold">
                  Serviços em destaque
                </div>
                <div class="text-body2 text-grey-7">
                  Escolha uma opção e agende seu horário.
                </div>
              </q-card-section>
              <q-separator />
              <q-list separator class="col scroll">
                <q-item
                  v-for="service in featuredServices"
                  :key="service.id"
                  class="q-py-md"
                >
                  <q-item-section avatar>
                    <q-avatar rounded color="grey-2" size="52px">
                      <q-img
                        v-if="getShowcaseServiceImage(service)"
                        :src="getShowcaseServiceImage(service)!"
                        :alt="service.name"
                      />
                      <q-icon
                        v-else
                        name="mdi-briefcase-outline"
                        color="grey-7"
                      />
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-bold">
                      {{ service.name }}
                    </q-item-label>
                    <q-item-label caption>
                      {{ formatShowcaseDuration(service.durationMinutes) }}
                    </q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <div class="text-weight-bold text-grey-9">
                      {{ formatShowcaseCurrency(service.price) }}
                    </div>
                    <q-btn
                      v-if="getServiceWhatsappUrl(service.name)"
                      label="Agendar"
                      dense
                      flat
                      no-caps
                      :style="{ color: secondaryColor }"
                      :href="getServiceWhatsappUrl(service.name) || undefined"
                      target="_blank"
                    />
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card>

            <q-card
              v-else-if="item.i === 'booking-cta'"
              flat
              bordered
              class="full-height"
            >
              <q-card-section
                class="full-height row items-center justify-center q-col-gutter-lg text-center"
              >
                <div class="col-12 col-sm">
                  <div class="text-h5 text-weight-bold">
                    Pronto para agendar?
                  </div>
                  <div class="text-body2 text-grey-7">
                    Escolha o melhor horário e fale com nossa equipe.
                  </div>
                </div>
                <div class="col-12 col-sm-auto">
                  <q-btn
                    label="Agendar agora"
                    icon="mdi-calendar-check"
                    no-caps
                    unelevated
                    text-color="white"
                    :disable="!whatsappUrl"
                    :href="whatsappUrl || undefined"
                    target="_blank"
                    rel="noopener noreferrer"
                    :style="{ backgroundColor: secondaryColor }"
                  />
                </div>
              </q-card-section>
            </q-card>

            <q-card
              v-else
              flat
              bordered
              class="full-height column flex-center text-grey-6"
            >
              <q-icon name="mdi-eye-off-outline" size="40px" />
              <div class="text-caption q-mt-sm">
                Conteúdo ainda não configurado
              </div>
            </q-card>
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
import {
  createDefaultShowcaseLayouts,
  showcaseDeviceColumns,
  type ShowcaseDevice,
  type ShowcaseLayoutItem,
} from "~/types/showcase-layout";
import {
  formatShowcaseCurrency,
  formatShowcaseDuration,
  getShowcaseServiceImage,
} from "~/composables/usePublicBusiness";
import ShowcaseAddress from "./ShowcaseAddress.vue";
import ShowcaseWorkingHours from "./ShowcaseWorkingHours.vue";

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
const promotionSlide = ref<string>("welcome");

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

const syncLayout = () => {
  const layout =
    savedLayouts.value?.[device.value] ??
    createDefaultShowcaseLayouts()[device.value];
  renderedLayout.value = layout.map((item) => ({ ...item }));
};

watch([device, savedLayouts], syncLayout, { immediate: true, deep: true });

const featuredServices = computed(() => props.business.services.slice(0, 5));
const promotionHighlights = computed(() =>
  props.business.serviceHighlights.slice(0, 5),
);
const getHighlightImage = (
  highlight: PublicBusiness["serviceHighlights"][number],
) =>
  highlight.imageUrl ||
  highlight.service.imageUrl ||
  highlight.service.illustration?.imageUrl ||
  null;
const bannerStyle = computed(() => ({
  background: `linear-gradient(135deg, ${props.primaryColor}, ${props.secondaryColor})`,
}));

watch(
  promotionHighlights,
  (highlights) => {
    promotionSlide.value = highlights[0]?.id ?? "welcome";
  },
  { immediate: true },
);
</script>

<style scoped>
.showcase-custom-layout {
  min-height: 240px;
}

:deep(.vgl-item:not(.vgl-item--placeholder)) {
  overflow: hidden;
  border-radius: 4px;
}

.showcase-layout-card {
  overflow: auto;
}
</style>
