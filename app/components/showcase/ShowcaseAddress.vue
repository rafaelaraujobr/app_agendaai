<template>
  <q-card flat bordered class="full-height overflow-hidden rounded-borders">
    <q-card-section class="q-pa-lg">
      <div class="row items-start no-wrap q-gutter-md">
        <div class="col">
          <div class="text-h6 text-weight-bold">Onde estamos</div>
          <div
            v-html="formattedAddress"
            class="text-body2 text-grey-7"
            style="white-space: pre-line"
          />
        </div>
        <q-btn
          icon="mdi-google-maps"
          aria-label="Abrir endereço no mapa"
          dense
          outline
          padding="sm md"
          :href="googleMapsUrl"
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
          :href="wazeMapsUrl"
          target="_blank"
          rel="noopener noreferrer"
        >
          <q-tooltip>Abrir no Waze</q-tooltip>
        </q-btn>
      </div>
    </q-card-section>

    <q-separator />

    <ClientOnly v-if="hasCoordinates">
      <div style="height: 340px">
        <LMap
          :zoom="16"
          :center="mapCenter"
          :use-global-leaflet="false"
          :options="{ scrollWheelZoom: false }"
        >
          <LTileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution="&copy; OpenStreetMap contributors &copy; CARTO"
            layer-type="base"
            name="CARTO Positron"
          />
          <LMarker :lat-lng="mapCenter">
            <LTooltip
              :options="{
                permanent: true,
                direction: 'top',
                offset: [0, -28],
                opacity: 1,
              }"
            >
              {{ businessName }}
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
</template>

<script setup lang="ts">
defineProps<{
  businessName: string;
  primaryColor: string;
  formattedAddress: string;
  googleMapsUrl: string;
  wazeMapsUrl: string;
  hasCoordinates: boolean;
  mapCenter: [number, number];
}>();
</script>
