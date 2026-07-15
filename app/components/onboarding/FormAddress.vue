<template>
  <OnboardingStepCard
    title="Endereço do seu negócio"
    subtitle="Preencha o endereço do seu negócio"
    :animation-data="BusinessAnimation"
  >
    <q-form ref="formRef" @submit.prevent="handleSubmit">
      <div class="row q-col-gutter-x-md">
        <div class="col-12">
          <label class="text-weight-medium text-subtitle2 q-mb-xs"> CEP </label>
          <q-input
            v-model="address.zipCode"
            outlined
            bg-color="grey-1"
            mask="#####-###"
            placeholder="Ex: 12345-678"
            dense
            maxlength="9"
            :loading="isLoadingZipCode"
            :rules="[(val) => (val && val.length > 0) || 'CEP é obrigatório']"
            @blur="getAddressByZipCode(address.zipCode)"
          />
        </div>

        <div class="col-12">
          <label class="text-weight-medium text-subtitle2 q-mb-xs">
            Rua/Avenida
          </label>
          <q-input
            v-model="address.street"
            outlined
            bg-color="grey-1"
            type="text"
            placeholder="Ex: Rua das Flores"
            dense
            maxlength="50"
            :rules="[
              (val) => (val && val.length > 0) || 'Rua/Avenida é obrigatório',
            ]"
          />
        </div>

        <div class="col-12">
          <label class="text-weight-medium text-subtitle2 q-mb-xs">
            Número
          </label>
          <q-input
            ref="numberAddressRef"
            v-model="address.number"
            outlined
            bg-color="grey-1"
            type="text"
            placeholder="Ex: 1234"
            dense
            maxlength="10"
            :readonly="notHaveNumber"
            :rules="[
              (val) =>
                notHaveNumber ||
                (val && val.length > 0) ||
                'Número é obrigatório',
            ]"
            @blur="geocodeAddress"
          >
            <template #append>
              <q-checkbox
                v-model="notHaveNumber"
                class="text-subtitle2"
                left-label
                dense
                label="Sem número"
                @update:model-value="handleNoNumberChange"
              />
            </template>
          </q-input>
        </div>

        <div class="col-12">
          <label class="text-weight-medium text-subtitle2 q-mb-xs">
            Complemento (opcional)
          </label>
          <q-input
            v-model="address.complement"
            outlined
            bg-color="grey-1"
            type="text"
            placeholder="Ex: Apt. 101"
            dense
          />
        </div>

        <div v-if="locationConfirmed" class="col-12 q-mt-md">
          <q-banner rounded class="bg-green-1 text-green-10">
            Localização confirmada.
            <template #action>
              <q-btn
                label="Revisar"
                flat
                dense
                no-caps
                padding="sm lg"
                color="green-10"
                @click="isMapDialogOpen = true"
              />
            </template>
          </q-banner>
        </div>

        <div v-if="locationError" class="col-12">
          <q-banner rounded class="bg-red-1 text-negative">
            <template #avatar>
              <q-icon name="mdi-alert-circle-outline" />
            </template>
            {{ locationError }}
          </q-banner>
        </div>
      </div>
    </q-form>

    <template #actions>
      <q-btn
        label="Voltar"
        unelevated
        no-caps
        flat
        dense
        padding="sm lg"
        color="primary"
        @click="$emit('previous')"
      />
      <q-btn
        label="Avançar"
        unelevated
        no-caps
        dense
        padding="sm lg"
        color="primary"
        :loading="isGeocoding"
        @click="handleSubmit"
      />
    </template>
  </OnboardingStepCard>

  <q-dialog v-model="isMapDialogOpen" persistent>
    <q-card
      class="full-width rounded-borders overflow-hidden"
      style="max-width: 700px"
    >
      <q-toolbar>
        <q-toolbar-title class="text-subtitle1">
          Confirme a localização
        </q-toolbar-title>
        <q-space />
        <q-btn
          icon="mdi-close"
          flat
          round
          dense
          color="primary"
          aria-label="Fechar mapa"
          @click="isMapDialogOpen = false"
        />
      </q-toolbar>

      <q-banner class="bg-grey-1 text-grey-8">
        <template #avatar>
          <q-icon
            name="mdi-cursor-move"
            color="primary"
            size="sm"
            class="q-mt-xs"
          />
        </template>
        Caso necessário, arraste o pin até o local correto do seu negócio.
      </q-banner>

      <q-banner
        v-if="!geocodingResult?.exact"
        dense
        class="bg-warning-light text-grey-9"
      >
        <template #avatar>
          <q-icon name="mdi-map-marker-alert-outline" color="secondary" />
        </template>
        A Geoapify retornou uma localização aproximada.
      </q-banner>

      <ClientOnly>
        <div v-if="candidatePosition" style="height: 360px">
          <LMap
            :zoom="17"
            :center="candidatePosition"
            :use-global-leaflet="false"
            :options="{
              scrollWheelZoom: false,
              zoomControl: true,
              attributionControl: true,
            }"
          >
            <LTileLayer
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              attribution="&copy; OpenStreetMap contributors &copy; CARTO"
              layer-type="base"
              name="CARTO Positron"
            />
            <LMarker
              :lat-lng="candidatePosition"
              draggable
              @moveend="handleMarkerMove"
            >
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
          <q-skeleton height="360px" square />
        </template>
      </ClientOnly>

      <q-card-section
        v-if="geocodingResult?.formattedAddress"
        class="text-caption text-grey-7"
      >
        {{ geocodingResult.formattedAddress }}
      </q-card-section>

      <q-separator />

      <q-card-actions align="right" class="q-pa-md">
        <q-btn
          label="Cancelar"
          flat
          no-caps
          color="primary"
          padding="sm lg"
          dense
          @click="isMapDialogOpen = false"
        />
        <q-btn
          label="Confirmar"
          padding="sm lg"
          dense
          unelevated
          no-caps
          color="primary"
          @click="confirmLocation"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import type { QForm } from "quasar";
import BusinessAnimation from "~/assets/lotties/maintenance_mode.json";
import type { OnboardingAddress } from "~/composables/useOnboarding";
import OnboardingStepCard from "./OnboardingStepCard.vue";

type FocusableInput = {
  focus: () => void;
};

type ViaCepResponse = {
  logradouro?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  erro?: boolean;
};

type GeocodingResult = {
  latitude: number;
  longitude: number;
  formattedAddress: string | null;
  exact: boolean;
  confidence: number | null;
  buildingConfidence: number | null;
  matchType: string | null;
  resultType: string | null;
};

type GeocodingResponse = {
  location: GeocodingResult;
};

type MarkerMoveEvent = {
  target: {
    getLatLng: () => {
      lat: number;
      lng: number;
    };
  };
};

const emit = defineEmits<{
  next: [];
  previous: [];
}>();

const formRef = ref<QForm | null>(null);
const address = defineModel<OnboardingAddress>("address", { required: true });
const notHaveNumber = defineModel<boolean>("notHaveNumber", {
  required: true,
});
const initialPosition: [number, number] | null =
  address.value.latitude !== 0 && address.value.longitude !== 0
    ? [address.value.latitude, address.value.longitude]
    : null;
const numberAddressRef = ref<FocusableInput | null>(null);
const $q = useQuasar();
const isLoadingZipCode = ref(false);
const isGeocoding = ref(false);
const geocodingResult = ref<GeocodingResult | null>(
  initialPosition
    ? {
        latitude: initialPosition[0],
        longitude: initialPosition[1],
        formattedAddress: null,
        exact: true,
        confidence: null,
        buildingConfidence: null,
        matchType: null,
        resultType: null,
      }
    : null,
);
const candidatePosition = ref<[number, number] | null>(initialPosition);
const locationConfirmed = ref(Boolean(initialPosition));
const isMapDialogOpen = ref(false);
const locationError = ref("");
const markerLabel = computed(() => {
  return (
    [address.value.street, address.value.number].filter(Boolean).join(", ") ||
    "Seu negócio"
  );
});

const invalidateLocation = () => {
  geocodingResult.value = null;
  candidatePosition.value = null;
  locationConfirmed.value = false;
  isMapDialogOpen.value = false;
  locationError.value = "";
  address.value.latitude = 0;
  address.value.longitude = 0;
};

const getAddressByZipCode = async (zipCode: string) => {
  const sanitizedZipCode = zipCode.replace(/\D/g, "");
  if (sanitizedZipCode.length !== 8) return;

  isLoadingZipCode.value = true;
  locationError.value = "";

  try {
    const response = await fetch(
      `https://viacep.com.br/ws/${sanitizedZipCode}/json/`,
    );
    if (!response.ok) throw new Error("Falha ao consultar o CEP");

    const data = (await response.json()) as ViaCepResponse;
    if (data.erro) throw new Error("CEP não encontrado");

    address.value.street = data.logradouro ?? "";
    address.value.neighborhood = data.bairro ?? "";
    address.value.city = data.localidade ?? "";
    address.value.state = data.uf ?? "";
    address.value.country = "Brasil";
    address.value.zipCode = sanitizedZipCode;
    numberAddressRef.value?.focus();
  } catch (error) {
    $q.notify({
      type: "negative",
      message:
        error instanceof Error
          ? error.message
          : "Não foi possível consultar o CEP",
    });
  } finally {
    isLoadingZipCode.value = false;
  }
};

const getApiErrorMessage = (error: unknown) => {
  const apiError = error as {
    data?: { statusMessage?: string; message?: string };
    statusMessage?: string;
    message?: string;
  };

  return (
    apiError.data?.statusMessage ??
    apiError.data?.message ??
    apiError.statusMessage ??
    apiError.message ??
    "Não foi possível localizar o endereço"
  );
};

const geocodeAddress = async () => {
  if (
    !address.value.street.trim() ||
    !address.value.city.trim() ||
    !address.value.state.trim() ||
    !address.value.zipCode.trim() ||
    (!notHaveNumber.value && !address.value.number.trim())
  ) {
    return;
  }

  isGeocoding.value = true;
  locationError.value = "";
  locationConfirmed.value = false;

  try {
    const response = await $fetch<GeocodingResponse>("/api/geocoding/address", {
      method: "POST",
      body: {
        street: address.value.street,
        number: notHaveNumber.value ? "" : address.value.number,
        neighborhood: address.value.neighborhood,
        city: address.value.city,
        state: address.value.state,
        zipCode: address.value.zipCode,
        country: address.value.country,
      },
    });

    geocodingResult.value = response.location;
    candidatePosition.value = [
      response.location.latitude,
      response.location.longitude,
    ];
    isMapDialogOpen.value = true;
  } catch (error) {
    geocodingResult.value = null;
    candidatePosition.value = null;
    locationError.value = getApiErrorMessage(error);
  } finally {
    isGeocoding.value = false;
  }
};

const handleMarkerMove = (event: MarkerMoveEvent) => {
  const { lat, lng } = event.target.getLatLng();
  candidatePosition.value = [lat, lng];
  locationConfirmed.value = false;
};

const confirmLocation = () => {
  if (!candidatePosition.value) return;

  address.value.latitude = candidatePosition.value[0];
  address.value.longitude = candidatePosition.value[1];
  locationConfirmed.value = true;
  isMapDialogOpen.value = false;
  locationError.value = "";
};

const handleNoNumberChange = (value: boolean) => {
  if (!value) {
    invalidateLocation();
    return;
  }

  address.value.number = "";
  nextTick(() => {
    void geocodeAddress();
  });
};

watch(
  () => [
    address.value.street,
    address.value.number,
    address.value.neighborhood,
    address.value.city,
    address.value.state,
    address.value.zipCode,
  ],
  invalidateLocation,
);

const handleSubmit = async () => {
  const isValid = await formRef.value?.validate();
  if (!isValid) return;

  if (!candidatePosition.value) {
    try {
      Loading.show();
      await geocodeAddress();
    } catch (error) {
      $q.notify({
        type: "negative",
        message: "Não foi possível localizar o endereço",
      });
    } finally {
      Loading.hide();
    }
    return;
  }

  if (!candidatePosition.value) return;

  if (!locationConfirmed.value) {
    isMapDialogOpen.value = true;
    locationError.value = "";
    return;
  }

  emit("next");
};
</script>
