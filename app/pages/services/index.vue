<template>
  <q-page padding class="wrapper">
    <q-toolbar class="q-px-none q-mb-md">
      <q-toolbar-title>
        <div class="text-h5 text-weight-medium">Serviços</div>
        <div class="text-caption text-grey-7">
          Gerencie os atendimentos oferecidos pelo seu negócio.
        </div>
      </q-toolbar-title>

      <q-btn
        :label="$q.screen.gt.xs ? 'Adicionar serviço' : undefined"
        icon="mdi-plus"
        color="primary"
        no-caps
        unelevated
        dense
        padding="sm md"
        :disable="hasReachedLimit"
        @click="openCreate"
      >
        <q-tooltip v-if="hasReachedLimit">
          Limite de serviços do plano atingido
        </q-tooltip>
      </q-btn>
    </q-toolbar>

    <q-banner
      v-if="summary.maxServices !== null"
      rounded
      class="bg-grey-1 text-grey-9 q-mb-md"
    >
      <template #avatar>
        <q-icon name="mdi-chart-donut" color="primary" />
      </template>
      <div class="row items-center q-col-gutter-md">
        <div class="col-12 col-sm">
          <div class="text-subtitle2">
            Plano {{ summary.plan || "atual" }}
          </div>
          <div class="text-caption text-grey-7">
            {{ summary.totalCount }} de {{ summary.maxServices }} serviços
            utilizados
          </div>
        </div>
        <div class="col-12 col-sm-5">
          <q-linear-progress
            rounded
            size="10px"
            :value="serviceLimitProgress"
            :color="hasReachedLimit ? 'negative' : 'primary'"
            track-color="grey-3"
          />
        </div>
      </div>
    </q-banner>

    <ServicesFilters
      v-model="filters"
      :total="pagination.total"
      :active-count="summary.activeCount"
    />

    <ServicesTable
      v-if="$q.screen.gt.sm"
      :services="services"
      :loading="isLoading"
      :deleting-id="deletingId"
      @edit="openEdit"
      @delete="confirmDelete"
      @toggle="toggleService"
    />

    <ServicesCardGrid
      v-else
      v-model="services"
      :loading="isLoading"
      :deleting-id="deletingId"
      :reorder-enabled="canReorder"
      :reordering="isReordering"
      :has-more="hasMoreServices"
      @edit="openEdit"
      @delete="confirmDelete"
      @toggle="toggleService"
      @reorder="reorderServices"
      @load-more="loadMoreServices"
    />

    <div
      v-if="$q.screen.gt.sm && pagination.totalPages > 1"
      class="row justify-center q-mt-lg"
    >
      <q-pagination
        :model-value="filters.page"
        :max="pagination.totalPages"
        :max-pages="$q.screen.lt.sm ? 5 : 8"
        direction-links
        boundary-links
        color="primary"
        @update:model-value="changePage"
      />
    </div>

    <ServiceFormDialog
      v-model="formDialog"
      :service="selectedService"
      :illustrations="illustrations"
      :saving="isSaving"
      @save="handleSave"
    />
  </q-page>
</template>

<script setup lang="ts">
import type { ManagedService, ServiceForm } from "~/types/service";
import ServiceFormDialog from "~/components/services/ServiceFormDialog.vue";
import ServicesCardGrid from "~/components/services/ServicesCardGrid.vue";
import ServicesFilters from "~/components/services/ServicesFilters.vue";
import ServicesTable from "~/components/services/ServicesTable.vue";

definePageMeta({
  layout: "default",
  middleware: "auth",
});

const $q = useQuasar();
const {
  services,
  illustrations,
  filters,
  pagination,
  summary,
  hasReachedLimit,
  isLoading,
  isSaving,
  isReordering,
  deletingId,
  loadServices,
  loadIllustrations,
  saveService,
  deleteService,
  toggleService,
  reorderServices,
} = useServices();

const formDialog = ref(false);
const selectedService = ref<ManagedService | null>(null);

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
  formDialog.value = true;
};

const openEdit = (service: ManagedService) => {
  selectedService.value = service;
  formDialog.value = true;
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
  await Promise.all([loadServices(), loadIllustrations()]);
});

onBeforeUnmount(() => clearTimeout(filterTimer));
</script>
