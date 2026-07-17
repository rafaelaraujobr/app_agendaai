<template>
  <q-header :style="{ backgroundColor: primaryColor }">
    <q-toolbar class="wrapper q-px-md" style="min-height: 51px">
      <q-toolbar-title class="row items-center no-wrap">
        <q-img
          v-if="business.logoUrl"
          :src="business.logoUrl"
          :alt="`Logo de ${business.name}`"
          fit="contain"
          style="max-width: 140px; max-height: 46px"
        />
        <span v-else class="text-subtitle1 text-weight-bold ellipsis">
          {{ business.name }}
        </span>
      </q-toolbar-title>

      <div
        v-if="business.businessChannels.length"
        class="row no-wrap q-gutter-xs"
      >
        <q-btn
          v-for="channel in business.businessChannels"
          :key="channel.type"
          :icon="showcaseChannelIcons[channel.type]"
          :aria-label="showcaseChannelLabels[channel.type]"
          :href="getShowcaseChannelUrl(channel.type, channel.channel)"
          target="_blank"
          rel="noopener noreferrer"
          flat
          round
          dense
        >
          <q-tooltip>
            {{ showcaseChannelLabels[channel.type] }}: {{ channel.channel }}
          </q-tooltip>
        </q-btn>
      </div>
    </q-toolbar>
  </q-header>
</template>

<script setup lang="ts">
import type { PublicBusiness } from "~/types/public-business";
import {
  getShowcaseChannelUrl,
  showcaseChannelIcons,
  showcaseChannelLabels,
} from "~/composables/useShowcaseChannels";

const props = defineProps<{
  business: PublicBusiness;
}>();

const primaryColor = computed(
  () => props.business.businessLayout?.primaryColor || "#1976d2",
);
</script>

<style scoped>
:deep(.q-img__image) {
  width: auto;
}
</style>
