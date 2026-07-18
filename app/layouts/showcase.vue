<template>
  <q-layout view="hHh lpR fFf" class="bg-white" :style="{ fontFamily }">
    <ShowcaseHeader v-if="business" :business="business" />
    <q-page-container>
      <slot />
      <ShowcaseFooter v-if="business" :business-name="business.name" />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import type { PublicBusiness } from "~/types/public-business";
import ShowcaseFooter from "~/components/showcase/ShowcaseFooter.vue";
import ShowcaseHeader from "~/components/showcase/ShowcaseHeader.vue";

const business = useState<PublicBusiness | null>(
  "showcase-business",
  () => null,
);

const fontFamily = computed(
  () => business.value?.businessLayout?.settings?.fontFamily || "Inter",
);
</script>
