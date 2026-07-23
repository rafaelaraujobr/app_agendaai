<template>
  <q-page padding class="services-page">
    <div class="row items-start q-col-gutter-lg q-mb-lg">
      <div class="col-12 col-md">
        <div class="text-h5 text-weight-medium">Serviços</div>
        <div class="text-body2 text-grey-7 q-mt-xs">
          Gerencie os serviços oferecidos pelo seu negócio.
        </div>
      </div>

      <div class="col-12 col-md-auto">
        <div class="row items-center q-gutter-md justify-end">
          <q-card
            v-if="summary.maxServices !== null"
            flat
            bordered
            class="plan-card rounded-borders"
          >
            <q-card-section class="q-pa-sm q-px-md">
              <div class="text-caption text-grey-7">
                Plano {{ planLabel }}
              </div>
              <div class="text-body2 text-weight-medium">
                {{ summary.totalCount }} de {{ summary.maxServices }} serviços
                utilizados
              </div>
              <q-linear-progress
                rounded
                size="8px"
                class="q-mt-sm"
                :value="serviceLimitProgress"
                :color="hasReachedLimit ? 'negative' : 'primary'"
                track-color="grey-3"
              />
            </q-card-section>
          </q-card>

          <q-btn
            label="Novo serviço"
            icon="mdi-plus"
            color="primary"
            no-caps
            unelevated
            padding="sm md"
            :disable="hasReachedLimit"
            @click="openCreate"
          >
            <q-tooltip v-if="hasReachedLimit">
              Limite de serviços do plano atingido
            </q-tooltip>
          </q-btn>
        </div>
      </div>
    </div>

    <q-card flat bordered class="rounded-borders services-card">
      <q-tabs
        v-model="activeTab"
        align="left"
        no-caps
        inline-label
        active-color="primary"
        indicator-color="primary"
        class="services-tabs q-px-md"
      >
        <q-tab
          name="services"
          :label="`Serviços (${summary.totalCount})`"
          icon="mdi-briefcase-outline"
        />
        <q-tab
          name="highlights"
          :label="`Destaques (${summary.highlightsCount}/${summary.maxHighlights})`"
          icon="mdi-star-outline"
        />
      </q-tabs>

      <q-separator />

      <template v-if="activeTab === 'services'">
        <q-card-section class="q-pb-none">
          <ServicesFilters
            v-model="filters"
            :total="summary.totalCount"
            :active-count="summary.activeCount"
          />
        </q-card-section>

        <q-separator />

        <q-card-section class="q-pt-none q-px-none">
          <ServicesTable
            v-if="$q.screen.gt.sm"
            v-model="services"
            :loading="isLoading"
            :deleting-id="deletingId"
            :reorder-enabled="canReorder"
            :reordering="isReordering"
            :can-highlight="!hasReachedHighlightLimit"
            @edit="openEdit"
            @delete="confirmDelete"
            @toggle="toggleService"
            @highlight="openHighlight"
            @reorder="reorderServices"
          />

          <ServicesCardGrid
            v-else
            v-model="services"
            :loading="isLoading"
            :deleting-id="deletingId"
            :reorder-enabled="canReorder"
            :reordering="isReordering"
            :has-more="hasMoreServices"
            :can-highlight="!hasReachedHighlightLimit"
            @edit="openEdit"
            @delete="confirmDelete"
            @toggle="toggleService"
            @highlight="openHighlight"
            @reorder="reorderServices"
            @load-more="loadMoreServices"
          />
        </q-card-section>

        <q-card-section
          v-if="$q.screen.gt.sm && pagination.totalPages > 1"
          class="row items-center justify-between q-pt-none"
        >
          <q-select
            v-model="filters.pageSize"
            :options="pageSizeOptions"
            dense
            outlined
            emit-value
            map-options
            style="min-width: 140px"
            label="Por página"
          />
          <q-pagination
            :model-value="filters.page"
            :max="pagination.totalPages"
            :max-pages="8"
            direction-links
            boundary-links
            color="primary"
            @update:model-value="changePage"
          />
        </q-card-section>
      </template>

      <template v-else>
        <q-card-section class="q-px-none q-pt-none">
          <ServiceHighlightsTable
            v-model="highlights"
            :loading="isLoadingHighlights"
            :removing-id="removingHighlightId"
            :reordering="isReorderingHighlights"
            @edit="openEditHighlight"
            @remove="confirmRemoveHighlight"
            @reorder="reorderHighlights"
          />
        </q-card-section>
      </template>
    </q-card>

    <q-banner
      v-if="activeTab === 'services' && canReorder"
      rounded
      class="bg-green-1 text-green-10 q-mt-md tip-banner"
    >
      <template #avatar>
        <q-icon name="mdi-lightbulb-on-outline" color="green-8" />
      </template>
      <div class="text-body2">
        Dica: arraste os serviços para definir a ordem em que aparecerão na sua
        página pública.
      </div>
    </q-banner>

    <ServiceFormDialog
      v-model="formDialog"
      :service="selectedService"
      :illustrations="illustrations"
      :saving="isSaving"
      :initial-form="formState"
      :max-highlights="summary.maxHighlights"
      :has-reached-highlight-limit="hasReachedHighlightLimit"
      @save="handleSave"
    />
  </q-page>
</template>

<script setup lang="ts">
import type { ManagedService, ServiceForm, ServiceHighlight } from "~/types/service";
import ServiceFormDialog from "~/components/services/ServiceFormDialog.vue";
import ServiceHighlightsTable from "~/components/services/ServiceHighlightsTable.vue";
import ServicesCardGrid from "~/components/services/ServicesCardGrid.vue";
import ServicesFilters from "~/components/services/ServicesFilters.vue";
import ServicesTable from "~/components/services/ServicesTable.vue";
import { createEmptyServiceForm } from "~/composables/useServices";

definePageMeta({
  layout: "default",
  middleware: "auth",
});

const $q = useQuasar();
const {
  services,
  highlights,
  illustrations,
  filters,
  pagination,
  summary,
  hasReachedLimit,
  hasReachedHighlightLimit,
  isLoading,
  isLoadingHighlights,
  isSaving,
  isReordering,
  isReorderingHighlights,
  deletingId,
  removingHighlightId,
  loadServices,
  loadHighlights,
  loadIllustrations,
  fetchServiceById,
  saveService,
  deleteService,
  toggleService,
  reorderServices,
  reorderHighlights,
  removeHighlight,
  buildServiceForm,
} = useServices();

const activeTab = ref<"services" | "highlights">("services");

const formDialog = ref(false);
const selectedService = ref<ManagedService | null>(null);
const formState = ref<ServiceForm>(createEmptyServiceForm());

const pageSizeOptions = [
  { label: "10 por página", value: 10 },
  { label: "20 por página", value: 20 },
  { label: "50 por página", value: 50 },
];

const planLabel = computed(() => {
  const labels: Record<string, string> = {
    FREE: "Free",
    PRO: "Pro",
    PREMIUM: "Premium",
  };
  return labels[summary.plan || ""] || "atual";
});

const serviceLimitProgress = computed(() => {
  if (!summary.maxServices) return 0;
  return Math.min(summary.totalCount / summary.maxServices, 1);
});

const canReorder = computed(
  () =>
    !filters.value.search &&
    filters.value.status === "all" &&
    filters.value.sortBy === "position" &&
    filters.value.sortOrder === "asc",
);

const hasMoreServices = computed(
  () => pagination.page < pagination.totalPages,
);

const openCreate = () => {
  if (hasReachedLimit.value) {
    $q.notify({
      type: "warning",
      message: "O limite de serviços do seu plano foi atingido",
    });
    return;
  }
  selectedService.value = null;
  formState.value = buildServiceForm();
  formDialog.value = true;
};

const openEdit = (service: ManagedService) => {
  selectedService.value = service;
  formState.value = buildServiceForm(service);
  formDialog.value = true;
};

const openHighlight = (service: ManagedService) => {
  if (hasReachedHighlightLimit.value) {
    $q.notify({
      type: "warning",
      message: "O limite de destaques foi atingido",
    });
    return;
  }
  selectedService.value = service;
  formState.value = buildServiceForm(service, { enableHighlight: true });
  formDialog.value = true;
};

const openEditHighlight = async (highlight: ServiceHighlight) => {
  try {
    const service = await fetchServiceById(highlight.serviceId);
    openEdit(service);
  } catch {
    $q.notify({
      type: "negative",
      message: "Não foi possível carregar o serviço do destaque",
    });
  }
};

const confirmRemoveHighlight = (highlight: ServiceHighlight) => {
  $q.dialog({
    title: "Remover destaque",
    message: `Deseja remover “${highlight.title}” dos destaques?`,
    cancel: { label: "Cancelar", flat: true, noCaps: true },
    ok: { label: "Remover", color: "negative", noCaps: true },
  }).onOk(() => removeHighlight(highlight));
};

const handleSave = async (form: ServiceForm, serviceId: string | null) => {
  const saved = await saveService(form, serviceId);
  if (saved) formDialog.value = false;
};

const confirmDelete = (service: ManagedService) => {
  $q.dialog({
    title: "Excluir serviço",
    message:
      service.appointmentCount > 0
        ? "Este serviço possui agendamentos. Desative-o para preservar o histórico."
        : `Deseja excluir “${service.name}”? Esta ação não poderá ser desfeita.`,
    cancel: service.appointmentCount
      ? undefined
      : { label: "Cancelar", flat: true, noCaps: true },
    ok: service.appointmentCount
      ? { label: "Entendi", color: "primary", noCaps: true }
      : { label: "Excluir", color: "negative", noCaps: true },
    persistent: true,
  }).onOk(async () => {
    if (!service.appointmentCount) await deleteService(service);
  });
};

const changePage = async (page: number) => {
  filters.value.page = page;
  await loadServices();
};

const loadMoreServices = async (done: (stop?: boolean) => void) => {
  if (!hasMoreServices.value) {
    done(true);
    return;
  }

  filters.value.page += 1;
  await loadServices(true);
  done(!hasMoreServices.value);
};

let filterTimer: ReturnType<typeof setTimeout> | undefined;
watch(
  () => [
    filters.value.search,
    filters.value.status,
    filters.value.sortBy,
    filters.value.sortOrder,
    filters.value.pageSize,
  ],
  () => {
    filters.value.page = 1;
    clearTimeout(filterTimer);
    filterTimer = setTimeout(loadServices, 250);
  },
);

onMounted(async () => {
  await Promise.all([loadServices(), loadIllustrations(), loadHighlights()]);
});

onBeforeUnmount(() => clearTimeout(filterTimer));
</script>

<style scoped lang="sass">
.services-page
  max-width: 1200px
  margin: 0 auto

.plan-card
  min-width: 220px

.services-card
  overflow: hidden

.services-tabs
  :deep(.q-tab)
    min-height: 52px
    font-weight: 500

.tip-banner
  border: 1px solid rgba(22, 163, 74, 0.15)
</style>
