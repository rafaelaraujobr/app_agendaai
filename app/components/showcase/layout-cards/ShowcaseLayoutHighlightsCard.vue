<template>
  <q-card flat bordered class="full-height column rounded-borders">
    <div class="col column highlights-carousel-shell">
      <q-carousel
        v-model="activeSlide"
        animated
        swipeable
        infinite
        :autoplay="7000"
        transition-prev="fade"
        transition-next="fade"
        control-color="primary"
        navigation
        arrows
        height="100%"
        class="col highlights-carousel"
      >
        <q-carousel-slide
          v-for="highlight in highlights"
          :key="highlight.id"
          :name="highlight.id"
          class="column no-wrap q-pa-md"
        >
          <q-card flat bordered class="highlight-slide full-width col column">
            <q-img
              v-if="getHighlightImage(highlight)"
              :src="getHighlightImage(highlight)!"
              :alt="highlight.title"
              :ratio="16 / 10"
              fit="cover"
            />
            <div
              v-else
              class="highlight-slide__placeholder"
              :style="placeholderStyle"
            >
              <q-icon name="mdi-image-outline" size="40px" />
            </div>

            <q-card-section class="col column justify-between q-pa-md">
              <div>
                <div class="text-h6 text-weight-bold">
                  {{ highlight.title }}
                </div>
                <div class="text-caption text-grey-7 q-mt-xs">
                  {{ highlight.service.name }}
                </div>
                <div
                  v-if="highlight.description"
                  class="text-body2 text-grey-8 q-mt-sm highlight-slide__description"
                >
                  {{ highlight.description }}
                </div>
              </div>

              <div class="row items-center justify-between q-mt-md">
                <div
                  class="text-h6 text-weight-bold"
                  :style="{ color: context.primaryColor }"
                >
                  {{ formatShowcaseCurrency(highlight.service.price) }}
                </div>
                <q-btn
                  v-if="context.getServiceWhatsappUrl(highlight.service.name)"
                  label="Agendar"
                  icon-right="mdi-arrow-right"
                  no-caps
                  unelevated
                  text-color="white"
                  padding="sm md"
                  :style="{ backgroundColor: context.secondaryColor }"
                  :href="
                    context.getServiceWhatsappUrl(highlight.service.name) ||
                    undefined
                  "
                  target="_blank"
                  rel="noopener noreferrer"
                />
              </div>
            </q-card-section>
          </q-card>
        </q-carousel-slide>
      </q-carousel>
    </div>
  </q-card>
</template>

<script setup lang="ts">
import type {
  ServiceHighlight,
  ShowcaseLayoutContext,
} from "~/types/showcase-layout-context";
import { formatShowcaseCurrency } from "~/composables/usePublicBusiness";

const props = defineProps<{ context: ShowcaseLayoutContext }>();

const activeSlide = ref<string>("");

const highlights = computed(() =>
  props.context.business.serviceHighlights.slice(0, 5),
);

const getHighlightImage = (highlight: ServiceHighlight) =>
  highlight.imageUrl ||
  highlight.service.imageUrl ||
  highlight.service.illustration?.imageUrl ||
  null;

const placeholderStyle = computed(() => ({
  color: props.context.primaryColor,
  background: `linear-gradient(135deg, ${props.context.primaryColor}14, ${props.context.secondaryColor}20)`,
}));

watch(
  highlights,
  (items) => {
    activeSlide.value = items[0]?.id ?? "";
  },
  { immediate: true },
);
</script>

<style scoped lang="sass">
.highlights-carousel-shell
  min-height: 320px
  padding-bottom: 8px

.highlights-carousel
  background: transparent

.highlight-slide
  overflow: hidden
  border-radius: 12px
  min-height: 100%

.highlight-slide__placeholder
  display: flex
  align-items: center
  justify-content: center
  aspect-ratio: 16 / 10

.highlight-slide__description
  display: -webkit-box
  overflow: hidden
  -webkit-box-orient: vertical
  -webkit-line-clamp: 2
  line-clamp: 2

:deep(.q-carousel__slide)
  padding: 0

:deep(.q-carousel__navigation .q-btn)
  margin: 0 3px

:deep(.q-carousel__navigation-icon)
  font-size: 9px

:deep(.q-carousel__arrow .q-btn)
  background: white
  box-shadow: 0 2px 8px rgb(0 0 0 / 12%)
</style>
