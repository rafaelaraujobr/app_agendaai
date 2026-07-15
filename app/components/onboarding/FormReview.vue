<template>
  <OnboardingStepCard
    title="Revisão final"
    subtitle="Confira as informações antes de criar o negócio."
    :animation-data="ReviewAnimation"
  >
    <div class="column q-gutter-md">
      <q-card flat bordered class="rounded-borders overflow-hidden">
        <q-toolbar class="bg-primary text-white">
          <q-img
            v-if="logoPreviewUrl"
            :src="logoPreviewUrl"
            :alt="`Logo de ${payload.business.name}`"
            :ratio="3"
            fit="contain"
            class="col-4"
          />

          <q-toolbar-title v-else class="text-subtitle1 text-weight-bold">
            {{ payload.business.name || "Seu negócio" }}
          </q-toolbar-title>

          <q-space v-if="logoPreviewUrl" />

          <div v-if="payload.businessChannels.length" class="row no-wrap">
            <q-btn
              v-for="channel in payload.businessChannels"
              :key="channel.type"
              :icon="channelIcons[channel.type]"
              :aria-label="channelLabels[channel.type]"
              flat
              round
              dense
            >
              <q-tooltip>
                {{ channelLabels[channel.type] }}: {{ channel.channel }}
              </q-tooltip>
            </q-btn>
          </div>

          <q-icon v-else name="mdi-link-variant-off" size="sm">
            <q-tooltip>Nenhum canal configurado</q-tooltip>
          </q-icon>
        </q-toolbar>

        <q-card-section class="bg-grey-1">
          <div class="text-caption text-grey-7">Endereço de acesso</div>
          <div class="text-subtitle2">
            https://{{ payload.business.slug || "seu-negocio" }}.roostec.com.br
          </div>
        </q-card-section>

        <q-separator />

        <ClientOnly>
          <div style="height: 220px">
            <LMap
              :zoom="mapZoom"
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
              <LMarker v-if="hasCoordinates" :lat-lng="mapCenter">
                <LIcon
                  :icon-url="markerIconUrl"
                  :icon-size="[42, 42]"
                  :icon-anchor="[21, 42]"
                />
                <LTooltip
                  :options="{
                    permanent: true,
                    direction: 'top',
                    offset: [0, -38],
                    opacity: 1,
                  }"
                >
                  {{ markerLabel }}
                </LTooltip>
              </LMarker>
            </LMap>
          </div>

          <template #fallback>
            <q-skeleton height="220px" square />
          </template>
        </ClientOnly>

        <q-banner
          v-if="!hasCoordinates"
          dense
          class="bg-orange-1 text-orange-10"
        >
          <template #avatar>
            <q-icon name="mdi-map-marker-alert-outline" />
          </template>
          Não foi possível localizar as coordenadas deste CEP.
        </q-banner>
      </q-card>

      <q-expansion-item
        dense
        expand-separator
        label="Ver payload do endpoint"
        class="bg-grey-1 rounded-borders border-xs-grey-3"
      >
        <q-card flat class="bg-grey-1">
          <q-card-section class="q-pa-sm">
            <pre class="text-caption q-ma-none">{{ payloadPreview }}</pre>
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </div>

    <template #actions>
      <q-btn
        label="Voltar"
        flat
        no-caps
        dense
        padding="sm lg"
        color="primary"
        :disable="loading"
        @click="$emit('previous')"
      />
      <q-btn
        label="Criar negócio"
        unelevated
        no-caps
        dense
        padding="sm lg"
        color="primary"
        :loading="loading"
        @click="$emit('submit')"
      />
    </template>
  </OnboardingStepCard>
</template>

<script setup lang="ts">
import ReviewAnimation from "~/assets/lotties/social_media.json";
import type { CreateBusinessPayload } from "~/composables/useOnboarding";
import OnboardingStepCard from "./OnboardingStepCard.vue";

const props = defineProps<{
  payload: CreateBusinessPayload;
  logoFile?: File | null;
  loading?: boolean;
}>();

defineEmits<{
  previous: [];
  submit: [];
}>();

type BusinessChannelType =
  CreateBusinessPayload["businessChannels"][number]["type"];

const channelIcons: Record<BusinessChannelType, string> = {
  WHATSAPP: "mdi-whatsapp",
  TELEGRAM: "mdi-send",
  INSTAGRAM: "mdi-instagram",
  FACEBOOK: "mdi-facebook",
};

const channelLabels: Record<BusinessChannelType, string> = {
  WHATSAPP: "WhatsApp",
  TELEGRAM: "Telegram",
  INSTAGRAM: "Instagram",
  FACEBOOK: "Facebook",
};

const markerIconUrl = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <path
      fill="#0E0B16"
      stroke="#FFFFFF"
      stroke-width="2"
      d="M24 2C15.16 2 8 9.16 8 18c0 12 16 28 16 28s16-16 16-28C40 9.16 32.84 2 24 2z"
    />
    <circle cx="24" cy="18" r="7" fill="#F59E0B" />
    <circle cx="24" cy="18" r="3" fill="#0E0B16" />
  </svg>
`)}`;

const markerLabel = computed(() => {
  const address = props.payload.businessAddress;
  return [address.address, address.number].filter(Boolean).join(", ");
});

const logoPreviewUrl = ref(props.payload.business.logoUrl);
let localLogoUrl: string | null = null;

const updateLogoPreview = () => {
  if (localLogoUrl) {
    URL.revokeObjectURL(localLogoUrl);
    localLogoUrl = null;
  }

  if (props.logoFile) {
    localLogoUrl = URL.createObjectURL(props.logoFile);
    logoPreviewUrl.value = localLogoUrl;
    return;
  }

  logoPreviewUrl.value = props.payload.business.logoUrl;
};

onMounted(updateLogoPreview);

watch(() => props.logoFile, updateLogoPreview);

onBeforeUnmount(() => {
  if (localLogoUrl) URL.revokeObjectURL(localLogoUrl);
});

const activeWorkingHoursCount = computed(() => {
  return props.payload.businessWorkingHours.filter(
    (workingHour) => workingHour.isActive,
  ).length;
});

const hasCoordinates = computed(() => {
  const { latitude, longitude } = props.payload.businessAddress;
  return (
    latitude !== null && longitude !== null && latitude !== 0 && longitude !== 0
  );
});

const mapCenter = computed<[number, number]>(() => {
  if (!hasCoordinates.value) return [-14.235, -51.9253];

  return [
    props.payload.businessAddress.latitude as number,
    props.payload.businessAddress.longitude as number,
  ];
});

const mapZoom = computed(() => (hasCoordinates.value ? 17 : 4));

const formattedAddress = computed(() => {
  const businessAddress = props.payload.businessAddress;
  return [
    businessAddress.address,
    businessAddress.number,
    businessAddress.neighborhood,
    businessAddress.city,
    businessAddress.state,
  ]
    .filter(Boolean)
    .join(", ");
});

const payloadPreview = computed(() => JSON.stringify(props.payload, null, 2));
</script>
