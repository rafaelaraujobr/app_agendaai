<template>
  <q-card flat bordered class="full-height overflow-hidden rounded-borders">
    <q-img
      v-if="context.business.bannerUrl"
      :src="context.business.bannerUrl"
      :alt="`Banner de ${context.business.name}`"
      fit="cover"
      class="full-height"
    >
      <div class="banner-overlay absolute-full column justify-end q-pa-lg">
        <div class="text-overline text-white">Bem-vindo</div>
        <div class="text-h4 text-weight-bold text-white">
          {{ context.business.name }}
        </div>
        <div
          v-if="context.business.description"
          class="text-body2 text-white q-mt-xs banner-description"
        >
          {{ context.business.description }}
        </div>
      </div>
    </q-img>

    <div
      v-else
      class="full-height column flex-center text-center q-pa-lg text-white"
      :style="bannerStyle"
    >
      <q-avatar v-if="context.business.logoUrl" size="80px" class="bg-white q-mb-md">
        <q-img :src="context.business.logoUrl" :alt="context.business.name" />
      </q-avatar>
      <q-icon v-else name="mdi-storefront-outline" size="64px" />
      <div class="text-h4 text-weight-bold q-mt-sm">
        {{ context.business.name }}
      </div>
      <div
        v-if="context.business.description"
        class="text-body1 q-mt-sm banner-description"
      >
        {{ context.business.description }}
      </div>
    </div>
  </q-card>
</template>

<script setup lang="ts">
import type { ShowcaseLayoutContext } from "~/types/showcase-layout-context";

const props = defineProps<{ context: ShowcaseLayoutContext }>();

const bannerStyle = computed(() => ({
  background: `linear-gradient(135deg, ${props.context.primaryColor}, ${props.context.secondaryColor})`,
}));
</script>

<style scoped lang="sass">
.banner-overlay
  background: linear-gradient(180deg, rgb(0 0 0 / 0%) 35%, rgb(0 0 0 / 72%) 100%)

.banner-description
  max-width: 560px
  opacity: 0.92
</style>
