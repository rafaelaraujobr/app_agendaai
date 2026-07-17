<template>
  <SettingsSectionCard
    title="Localização"
    subtitle="Atualize o endereço e ajuste a posição exata no mapa."
    icon="mdi-map-marker-outline"
    :loading="loading"
    @save="$emit('save')"
  >
    <q-form class="row q-col-gutter-x-md">
      <div class="col-12 col-sm-4">
        <label class="text-weight-medium text-subtitle2 q-mb-xs"> CEP </label>
        <q-input
          v-model="model.address.zipCode"
          mask="#####-###"
          outlined
          bg-color="grey-1"
          dense
          :loading="isLoadingZipCode"
          :rules="[(value) => Boolean(value) || 'Informe o CEP']"
          @update:model-value="invalidateLocation"
          @blur="getAddressByZipCode"
        />
      </div>
      <div class="col-12 col-sm-8">
        <label class="text-weight-medium text-subtitle2 q-mb-xs">
          Rua/Avenida
        </label>
        <q-input
          v-model="model.address.street"
          outlined
          bg-color="grey-1"
          dense
          maxlength="255"
          :rules="[(value) => Boolean(value) || 'Informe o endereço']"
          @update:model-value="invalidateLocation"
        />
      </div>
      <div class="col-12 col-sm-3">
        <label class="text-weight-medium text-subtitle2 q-mb-xs">
          Número
        </label>
        <q-input
          v-model="model.address.number"
          outlined
          bg-color="grey-1"
          dense
          maxlength="30"
          :readonly="model.notHaveNumber"
          :rules="[
            (value) =>
              model.notHaveNumber || Boolean(value) || 'Informe o número',
          ]"
          @update:model-value="invalidateLocation"
        >
          <template #append>
            <div class="text-subtitle2">
              <q-checkbox
                v-model="model.notHaveNumber"
                label="S/N"
                dense
                @update:model-value="handleNoNumber"
              >
                <q-tooltip>
                  <span class="text-caption">Sem número</span>
                </q-tooltip>
              </q-checkbox>
            </div>
          </template>
        </q-input>
      </div>
      <div class="col-12 col-sm-5">
        <label class="text-weight-medium text-subtitle2 q-mb-xs">
          Complemento
        </label>
        <q-input
          v-model="model.address.complement"
          outlined
          bg-color="grey-1"
          dense
          maxlength="150"
        />
      </div>
      <div class="col-12 col-sm-4">
        <label class="text-weight-medium text-subtitle2 q-mb-xs">
          Bairro
        </label>
        <q-input
          v-model="model.address.neighborhood"
          outlined
          bg-color="grey-1"
          dense
          maxlength="150"
          @update:model-value="invalidateLocation"
        />
      </div>
      <div class="col-12 col-sm-5">
        <label class="text-weight-medium text-subtitle2 q-mb-xs">
          Cidade
        </label>
        <q-input
          v-model="model.address.city"
          outlined
          bg-color="grey-1"
          dense
          maxlength="150"
          :rules="[(value) => Boolean(value) || 'Informe a cidade']"
          @update:model-value="invalidateLocation"
        />
      </div>
      <div class="col-12 col-sm-3">
        <label class="text-weight-medium text-subtitle2 q-mb-xs">
          Estado
        </label>
        <q-select
          v-model="model.address.state"
          :options="statesOptions"
          outlined
          bg-color="grey-1"
          dense
          emit-value
          map-options
          dropdown-icon="mdi-chevron-down"
          :rules="[(value) => String(value ?? '').length === 2 || 'Use a UF']"
          @update:model-value="updateState"
        />
      </div>
      <div class="col-12 col-sm-4">
        <label class="text-weight-medium text-subtitle2 q-mb-xs"> País </label>
        <q-input
          v-model="model.address.country"
          outlined
          disable
          bg-color="grey-1"
          dense
          maxlength="100"
          @update:model-value="invalidateLocation"
        />
      </div>

      <div class="col-12">
        <div class="row items-center justify-between q-gutter-sm q-mb-sm">
          <div>
            <div class="text-subtitle2 text-weight-medium">Posição no mapa</div>
            <div class="text-caption text-grey-7">
              Arraste o marcador para ajustar o local exato.
            </div>
          </div>
          <q-btn
            label="Localizar com endereço"
            no-caps
            dense
            padding="sm md"
            class="border-xs-grey-4"
            :loading="isGeocoding"
            @click="findLocation"
          />
        </div>

        <q-card flat bordered class="rounded-borders overflow-hidden">
          <ClientOnly>
            <div v-if="mapCenter" style="height: 260px">
              <LMap
                :zoom="17"
                :center="mapCenter"
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
                  :lat-lng="mapCenter"
                  draggable
                  @moveend="handleMarkerMove"
                >
                  <LTooltip
                    :options="{
                      permanent: true,
                      direction: 'top',
                      offset: [0, -24],
                      opacity: 1,
                    }"
                  >
                    {{ markerLabel }}
                  </LTooltip>
                </LMarker>
              </LMap>
            </div>
            <div
              v-else
              class="column flex-center text-grey-7 q-pa-xl"
              style="min-height: 260px"
            >
              <q-icon name="mdi-map-marker-question-outline" size="48px" />
              <div class="text-subtitle2 q-mt-sm">
                Localize o endereço para visualizar o mapa
              </div>
            </div>
            <template #fallback>
              <q-skeleton height="360px" square />
            </template>
          </ClientOnly>
        </q-card>
      </div>
    </q-form>
  </SettingsSectionCard>
</template>

<script setup lang="ts">
import type { SettingsForm } from "~/composables/useSettings";
import SettingsSectionCard from "./SettingsSectionCard.vue";

type ViaCepResponse = {
  logradouro?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  erro?: boolean;
};

type GeocodingResponse = {
  location: {
    latitude: number;
    longitude: number;
  };
};

type MarkerMoveEvent = {
  target: {
    getLatLng: () => { lat: number; lng: number };
  };
};

defineProps<{ loading?: boolean }>();
defineEmits<{ save: [] }>();
const model = defineModel<SettingsForm>({ required: true });
const $q = useQuasar();
const isLoadingZipCode = ref(false);
const isGeocoding = ref(false);

const mapCenter = computed<[number, number] | null>(() => {
  const { latitude, longitude } = model.value.address;
  return latitude && longitude ? [latitude, longitude] : null;
});

const markerLabel = computed(
  () =>
    [model.value.address.street, model.value.address.number]
      .filter(Boolean)
      .join(", ") || model.value.businessName,
);

const invalidateLocation = () => {
  model.value.locationConfirmed = false;
  model.value.address.latitude = 0;
  model.value.address.longitude = 0;
};

const getAddressByZipCode = async () => {
  const zipCode = model.value.address.zipCode.replace(/\D/g, "");
  if (zipCode.length !== 8) return;
  isLoadingZipCode.value = true;
  try {
    const response = await $fetch<ViaCepResponse>(
      `https://viacep.com.br/ws/${zipCode}/json/`,
    );
    if (response.erro) throw new Error("CEP não encontrado");
    model.value.address.street = response.logradouro ?? "";
    model.value.address.neighborhood = response.bairro ?? "";
    model.value.address.city = response.localidade ?? "";
    model.value.address.state = response.uf ?? "";
    invalidateLocation();
  } catch {
    $q.notify({
      type: "negative",
      message: "Não foi possível consultar o CEP",
    });
  } finally {
    isLoadingZipCode.value = false;
  }
};

const findLocation = async () => {
  const address = model.value.address;
  if (
    address.street.trim().length < 2 ||
    address.city.trim().length < 2 ||
    address.state.trim().length !== 2 ||
    address.zipCode.replace(/\D/g, "").length !== 8
  ) {
    $q.notify({
      type: "warning",
      message: "Preencha CEP, endereço, cidade e estado antes de localizar",
    });
    return;
  }

  isGeocoding.value = true;
  try {
    const response = await $fetch<GeocodingResponse>("/api/geocoding/address", {
      method: "POST",
      body: {
        street: address.street,
        number: model.value.notHaveNumber ? "" : address.number,
        neighborhood: address.neighborhood,
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
        country: address.country,
      },
    });
    address.latitude = response.location.latitude;
    address.longitude = response.location.longitude;
    model.value.locationConfirmed = true;
  } catch {
    $q.notify({
      type: "negative",
      message: "Não foi possível localizar o endereço informado",
    });
  } finally {
    isGeocoding.value = false;
  }
};

const statesOptions = ref<{ label: string; value: string }[]>([
  {
    label: "Rio de Janeiro",
    value: "RJ",
  },
  {
    label: "São Paulo",
    value: "SP",
  },
  {
    label: "Minas Gerais",
    value: "MG",
  },
  {
    label: "Bahia",
    value: "BA",
  },
  {
    label: "Ceará",
    value: "CE",
  },
  {
    label: "Paraná",
    value: "PR",
  },
  {
    label: "Rio Grande do Sul",
    value: "RS",
  },
  {
    label: "Mato Grosso do Sul",
    value: "MS",
  },
  {
    label: "Mato Grosso",
    value: "MT",
  },
  {
    label: "Goiás",
    value: "GO",
  },
  {
    label: "Distrito Federal",
    value: "DF",
  },
  {
    label: "Espírito Santo",
    value: "ES",
  },
  {
    label: "Rio Grande do Norte",
    value: "RN",
  },
  {
    label: "Pernambuco",
    value: "PE",
  },
  {
    label: "Alagoas",
    value: "AL",
  },
]);

const handleMarkerMove = (event: MarkerMoveEvent) => {
  const { lat, lng } = event.target.getLatLng();
  model.value.address.latitude = lat;
  model.value.address.longitude = lng;
  model.value.locationConfirmed = true;
};

const handleNoNumber = (withoutNumber: boolean) => {
  if (withoutNumber) model.value.address.number = "";
  invalidateLocation();
};

const updateState = (value: string | number | null) => {
  model.value.address.state = String(value ?? "").toUpperCase();
  invalidateLocation();
};
</script>
