import type { Component } from "vue";
import type { ShowcaseCardId } from "~/types/showcase-layout";
import ShowcaseLayoutAddressCard from "./ShowcaseLayoutAddressCard.vue";
import ShowcaseLayoutBannerCard from "./ShowcaseLayoutBannerCard.vue";
import ShowcaseLayoutBookingCtaCard from "./ShowcaseLayoutBookingCtaCard.vue";
import ShowcaseLayoutFeaturedServicesCard from "./ShowcaseLayoutFeaturedServicesCard.vue";
import ShowcaseLayoutHighlightsCard from "./ShowcaseLayoutHighlightsCard.vue";
import ShowcaseLayoutWorkingHoursCard from "./ShowcaseLayoutWorkingHoursCard.vue";

export const showcaseLayoutCardComponents: Record<ShowcaseCardId, Component> = {
  address: ShowcaseLayoutAddressCard,
  "working-hours": ShowcaseLayoutWorkingHoursCard,
  banner: ShowcaseLayoutBannerCard,
  promotions: ShowcaseLayoutHighlightsCard,
  "featured-services": ShowcaseLayoutFeaturedServicesCard,
  "booking-cta": ShowcaseLayoutBookingCtaCard,
};
