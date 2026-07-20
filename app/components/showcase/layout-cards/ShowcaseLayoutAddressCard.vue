<template>
  <q-card
    v-if="context.business.businessAddress"
    flat
    bordered
    class="full-height overflow-hidden rounded-borders"
  >
    <q-card-section class="q-pa-lg">
      <div class="row items-start no-wrap q-gutter-md">
        <div class="col">
          <div class="text-h6 text-weight-bold">Onde estamos</div>
          <div
            class="text-body2 text-grey-7"
            style="white-space: pre-line"
          >
            {{ context.formattedAddress }}
          </div>
        </div>
        <q-btn
          icon="mdi-google-maps"
          aria-label="Abrir endereço no mapa"
          dense
          outline
          padding="sm md"
          :href="context.googleMapsUrl"
          target="_blank"
          rel="noopener noreferrer"
        >
          <q-tooltip>Abrir no Google Maps</q-tooltip>
        </q-btn>
        <q-btn
          icon="mdi-waze"
          aria-label="Abrir endereço no Waze"
          dense
          padding="sm md"
          outline
          :href="context.wazeMapsUrl"
          target="_blank"
          rel="noopener noreferrer"
        >
          <q-tooltip>Abrir no Waze</q-tooltip>
        </q-btn>
      </div>
    </q-card-section>

    <q-separator />

    <ClientOnly v-if="context.hasCoordinates">
      <div style="height: 340px">
        <LMap
          :zoom="16"
          :center="context.mapCenter"
          :use-global-leaflet="false"
          :options="{ scrollWheelZoom: false }"
        >
          <LTileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution="&copy; OpenStreetMap contributors &copy; CARTO"
            layer-type="base"
            name="CARTO Positron"
          />
          <LMarker :lat-lng="context.mapCenter">
            <LTooltip
              :options="{
                permanent: true,
                direction: 'top',
                offset: [0, -28],
                opacity: 1,
              }"
            >
              {{ context.business.name }}
            </LTooltip>
          </LMarker>
        </LMap>
      </div>
      <template #fallback>
        <q-skeleton height="340px" square />
      </template>
    </ClientOnly>

    <q-banner v-else class="bg-grey-1 text-grey-8">
      <template #avatar>
        <q-icon name="mdi-map-marker-alert-outline" />
      </template>
      A localização no mapa ainda não está disponível.
    </q-banner>
  </q-card>

  <ShowcaseLayoutEmptyCard v-else message="Endereço ainda não configurado" />
</template>

<script setup lang="ts">
import type { ShowcaseLayoutContext } from "~/types/showcase-layout-context";
import ShowcaseLayoutEmptyCard from "./ShowcaseLayoutEmptyCard.vue";

defineProps<{ context: ShowcaseLayoutContext }>();
</script>
