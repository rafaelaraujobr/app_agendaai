<template>
  <section class="q-pt-lg q-pb-xl">
    <q-card flat bordered class="rounded-borders">
      <q-card-section class="q-pa-lg">
        <div class="row items-center q-col-gutter-lg">
          <div class="col-12 col-md">
            <div class="text-h6 text-weight-bold">Entre em contato</div>
            <div class="text-body2 text-grey-7">
              Acompanhe nossos canais e fale com nossa equipe.
            </div>
          </div>
          <div class="col-12 col-md-auto">
            <div class="row q-col-gutter-sm">
              <div
                v-for="channel in channels"
                :key="channel.type"
                class="col-12 col-sm-auto"
              >
                <q-btn
                  class="full-width"
                  :icon="showcaseChannelIcons[channel.type]"
                  :label="showcaseChannelLabels[channel.type]"
                  outline
                  no-caps
                  :style="{ color: primaryColor }"
                  :href="getShowcaseChannelUrl(channel.type, channel.channel)"
                  target="_blank"
                  rel="noopener noreferrer"
                />
              </div>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </section>
</template>

<script setup lang="ts">
import type { PublicBusiness } from "~/types/public-business";
import {
  getShowcaseChannelUrl,
  showcaseChannelIcons,
  showcaseChannelLabels,
} from "~/composables/useShowcaseChannels";

defineProps<{
  channels: PublicBusiness["businessChannels"];
  primaryColor: string;
}>();
</script>
