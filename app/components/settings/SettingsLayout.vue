<template>
  <SettingsSectionCard
    title="Organização da página pública"
    subtitle="Defina quais cards aparecem e organize cada tipo de dispositivo."
    icon="mdi-view-dashboard-edit-outline"
    :loading="loading"
    save-label="Salvar layout"
    @save="$emit('save')"
  >
    <div class="row items-center justify-between q-col-gutter-md q-mb-md">
      <div class="col-12 col-md-auto">
        <q-btn-toggle
          v-model="device"
          no-caps
          unelevated
          toggle-color="primary"
          color="grey-2"
          text-color="grey-8"
          :options="deviceOptions"
        />
      </div>
      <div class="col-12 col-md-auto">
        <q-btn
          label="Restaurar padrão"
          icon="mdi-restore"
          outline
          no-caps
          color="primary"
          @click="resetCurrentLayout"
        />
      </div>
    </div>

    <q-banner rounded class="bg-blue-1 text-primary q-mb-md">
      <template #avatar>
        <q-icon name="mdi-gesture-tap-hold" />
      </template>
      Arraste pelo cabeçalho e use o canto inferior direito para redimensionar.
      As alterações desta aba afetam apenas {{ currentDeviceLabel }}.
    </q-banner>

    <div class="row q-col-gutter-lg">
      <div class="col-12 col-lg-3">
        <q-list bordered separator class="rounded-borders">
          <q-item-label header>Cards disponíveis</q-item-label>
          <q-item
            v-for="card in showcaseCardDefinitions"
            :key="card.id"
            tag="label"
            clickable
          >
            <q-item-section side>
              <q-icon :name="card.icon" color="primary" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ card.label }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-toggle
                :model-value="isCardActive(card.id)"
                color="primary"
                @update:model-value="toggleCard(card.id, $event)"
              />
            </q-item-section>
          </q-item>
        </q-list>
      </div>

      <div class="col-12 col-lg-9">
        <div class="text-caption text-grey-7 q-mb-sm">
          Pré-visualização: {{ currentDeviceLabel }} ·
          {{ currentColumns }} colunas
        </div>
        <div
          class="layout-preview-shell bg-grey-2 q-pa-sm rounded-borders"
          :class="`layout-preview-shell--${device}`"
        >
          <ClientOnly>
            <GridLayout
              v-model:layout="currentLayout"
              :col-num="currentColumns"
              :row-height="48"
              :margin="[8, 8]"
              :is-draggable="true"
              :is-resizable="true"
              :use-css-transforms="true"
              :vertical-compact="true"
              class="showcase-layout-editor"
            >
              <GridItem
                v-for="item in currentLayout"
                :key="item.i"
                :i="item.i"
                :x="item.x"
                :y="item.y"
                :w="item.w"
                :h="item.h"
                :min-w="1"
                :min-h="item.minH || 2"
                drag-allow-from=".layout-drag-handle"
                drag-ignore-from="button, a"
              >
                <q-card flat bordered class="full-height column no-wrap">
                  <q-toolbar
                    class="layout-drag-handle bg-grey-1"
                    style="min-height: 36px"
                  >
                    <q-icon
                      :name="getCardDefinition(item.i).icon"
                      color="primary"
                      size="20px"
                      class="q-mr-sm"
                    />
                    <q-toolbar-title class="text-caption text-weight-bold">
                      {{ getCardDefinition(item.i).label }}
                    </q-toolbar-title>
                    <q-btn
                      icon="mdi-close"
                      aria-label="Remover card"
                      flat
                      round
                      dense
                      size="sm"
                      @click="removeCard(item.i)"
                    />
                  </q-toolbar>
                  <q-separator />
                  <q-card-section class="col scroll q-pa-sm">
                    <div v-if="item.i === 'banner'" class="preview-banner">
                      <q-icon name="mdi-storefront-outline" size="32px" />
                      <div class="text-subtitle2 text-weight-bold">
                        {{ model.businessName || "Nome do negócio" }}
                      </div>
                    </div>

                    <template v-else-if="item.i === 'address'">
                      <div class="text-weight-bold">Onde estamos</div>
                      <div class="text-caption text-grey-7 q-mt-xs">
                        {{
                          [
                            model.address.street,
                            model.address.number,
                            model.address.city,
                          ]
                            .filter(Boolean)
                            .join(", ") || "Endereço do estabelecimento"
                        }}
                      </div>
                      <div class="preview-map bg-grey-3 q-mt-sm">
                        <q-icon
                          name="mdi-map-marker"
                          color="primary"
                          size="32px"
                        />
                      </div>
                    </template>

                    <template v-else-if="item.i === 'working-hours'">
                      <div class="text-weight-bold">Horário de atendimento</div>
                      <q-list dense separator class="q-mt-xs">
                        <q-item
                          v-for="hour in model.workingHours.slice(0, 4)"
                          :key="hour.dayOfWeek"
                          class="q-px-none"
                        >
                          <q-item-section>
                            <q-skeleton type="text" width="75px" />
                          </q-item-section>
                          <q-item-section side>
                            <span class="text-caption">
                              {{ hour.isActive ? "09:00 às 18:00" : "Fechado" }}
                            </span>
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </template>

                    <template v-else-if="item.i === 'featured-services'">
                      <div class="text-weight-bold">Serviços em destaque</div>
                      <div
                        v-for="index in 3"
                        :key="index"
                        class="row items-center no-wrap q-gutter-sm q-mt-sm"
                      >
                        <q-avatar rounded color="grey-3" size="34px" />
                        <div class="col">
                          <q-skeleton type="text" width="70%" />
                          <q-skeleton type="text" width="35%" />
                        </div>
                      </div>
                    </template>

                    <template v-else-if="item.i === 'promotions'">
                      <div class="preview-promotion full-height column flex-center">
                        <q-icon
                          name="mdi-sale-outline"
                          size="36px"
                          color="primary"
                        />
                        <div class="text-subtitle2 text-weight-bold q-mt-xs">
                          Promoções e novidades
                        </div>
                        <div class="text-caption text-grey-7">
                          Carrossel de destaques
                        </div>
                      </div>
                    </template>

                    <div
                      v-else
                      class="full-height column flex-center text-center"
                    >
                      <div class="text-subtitle2 text-weight-bold">
                        Agende seu horário
                      </div>
                      <q-btn
                        label="Agendar agora"
                        icon="mdi-calendar-check"
                        color="primary"
                        unelevated
                        no-caps
                        size="sm"
                        class="q-mt-sm"
                      />
                    </div>
                  </q-card-section>
                </q-card>
              </GridItem>
            </GridLayout>

            <template #fallback>
              <q-skeleton height="520px" square />
            </template>
          </ClientOnly>

          <div
            v-if="!currentLayout.length"
            class="column items-center justify-center text-grey-7 q-pa-xl"
          >
            <q-icon name="mdi-view-dashboard-outline" size="48px" />
            <div class="q-mt-sm">Adicione cards para montar esta página.</div>
          </div>
        </div>
      </div>
    </div>
  </SettingsSectionCard>
</template>

<script setup lang="ts">
import { GridItem, GridLayout } from "grid-layout-plus";
import type { SettingsForm } from "~/composables/useSettings";
import {
  createDefaultShowcaseLayouts,
  showcaseCardDefinitions,
  showcaseDeviceColumns,
  type ShowcaseCardId,
  type ShowcaseDevice,
  type ShowcaseLayoutItem,
} from "~/types/showcase-layout";

defineProps<{
  loading: boolean;
}>();

defineEmits<{ save: [] }>();

const model = defineModel<SettingsForm>({ required: true });
const device = ref<ShowcaseDevice>("desktop");

const deviceOptions = [
  { label: "Celular", value: "mobile", icon: "mdi-cellphone" },
  { label: "Tablet", value: "tablet", icon: "mdi-tablet" },
  { label: "Desktop", value: "desktop", icon: "mdi-monitor" },
];

const deviceLabels: Record<ShowcaseDevice, string> = {
  mobile: "celular",
  tablet: "tablet",
  desktop: "desktop",
};

const currentDeviceLabel = computed(() => deviceLabels[device.value]);
const currentColumns = computed(() => showcaseDeviceColumns[device.value]);
const currentLayout = computed({
  get: () => model.value.showcaseLayouts[device.value],
  set: (layout: ShowcaseLayoutItem[]) => {
    model.value.showcaseLayouts[device.value] = layout;
  },
});

const getCardDefinition = (id: ShowcaseCardId) =>
  showcaseCardDefinitions.find((card) => card.id === id) ??
  showcaseCardDefinitions[0];

const isCardActive = (id: ShowcaseCardId) =>
  currentLayout.value.some((item) => item.i === id);

const removeCard = (id: ShowcaseCardId) => {
  currentLayout.value = currentLayout.value.filter((item) => item.i !== id);
};

const addCard = (id: ShowcaseCardId) => {
  if (isCardActive(id)) return;
  const defaultItem = createDefaultShowcaseLayouts()[device.value].find(
    (item) => item.i === id,
  );
  const bottom = currentLayout.value.reduce(
    (maximum, item) => Math.max(maximum, item.y + item.h),
    0,
  );

  currentLayout.value = [
    ...currentLayout.value,
    {
      ...(defaultItem ?? {
        i: id,
        x: 0,
        y: bottom,
        w: currentColumns.value,
        h: 4,
      }),
      x: 0,
      y: bottom,
      w: Math.min(defaultItem?.w ?? currentColumns.value, currentColumns.value),
    },
  ];
};

const toggleCard = (id: ShowcaseCardId, enabled: boolean) => {
  if (enabled) addCard(id);
  else removeCard(id);
};

const resetCurrentLayout = () => {
  currentLayout.value = createDefaultShowcaseLayouts()[device.value];
};
</script>

<style scoped lang="sass">
.layout-preview-shell
  width: 100%
  margin-inline: auto
  overflow-x: hidden
  transition: max-width 200ms ease

.layout-preview-shell--mobile
  max-width: 420px

.layout-preview-shell--tablet
  max-width: 760px

.layout-preview-shell--desktop
  max-width: 100%

.showcase-layout-editor
  min-height: 260px
  background-image: linear-gradient(to right, rgb(0 0 0 / 5%) 1px, transparent 1px), linear-gradient(to bottom, rgb(0 0 0 / 5%) 1px, transparent 1px)
  background-size: 48px 56px

:deep(.vgl-item:not(.vgl-item--placeholder))
  overflow: hidden
  border-radius: 4px

.layout-drag-handle
  cursor: move

.preview-banner,
.preview-promotion,
.preview-map
  display: flex
  align-items: center
  justify-content: center
  flex-direction: column
  min-height: 100%
  border-radius: 4px

.preview-banner
  color: white
  background: linear-gradient(135deg, v-bind('model.primaryColor'), v-bind('model.secondaryColor'))

.preview-map
  min-height: 110px
</style>
