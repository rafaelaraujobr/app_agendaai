<template>
  <div class="services-filters">
    <div class="row q-col-gutter-md items-center">
      <div class="col-12 col-md-5">
        <q-input
          v-model="model.search"
          placeholder="Buscar serviço..."
          outlined
          dense
          clearable
          bg-color="white"
          debounce="400"
          @update:model-value="model.page = 1"
        >
          <template #prepend>
            <q-icon name="mdi-magnify" />
          </template>
        </q-input>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-select
          v-model="model.status"
          :options="statusOptions"
          label="Status"
          outlined
          dense
          emit-value
          map-options
          bg-color="white"
          dropdown-icon="mdi-chevron-down"
          @update:model-value="model.page = 1"
        />
      </div>

      <div class="col-12 col-sm-6 col-md-4">
        <q-select
          v-model="sort"
          label="Ordenar serviços"
          :options="sortOptions"
          outlined
          dense
          emit-value
          map-options
          bg-color="white"
          dropdown-icon="mdi-chevron-down"
        />
      </div>
    </div>

    <div class="text-caption text-grey-7 q-mt-md">
      {{ total }} serviço(s) • {{ activeCount }} ativo(s) •
      {{ inactiveCount }} inativo(s)
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ServiceFilters } from "~/types/service";

const props = defineProps<{
  total: number;
  activeCount: number;
}>();

const model = defineModel<ServiceFilters>({ required: true });

const inactiveCount = computed(() =>
  Math.max(props.total - props.activeCount, 0),
);

const statusOptions = [
  { label: "Todos", value: "all" },
  { label: "Ativos", value: "active" },
  { label: "Inativos", value: "inactive" },
];

const sortOptions = [
  { label: "Posição", value: "position:asc" },
  { label: "Nome (A–Z)", value: "name:asc" },
  { label: "Nome (Z–A)", value: "name:desc" },
  { label: "Menor preço", value: "price:asc" },
  { label: "Maior preço", value: "price:desc" },
  { label: "Mais recentes", value: "createdAt:desc" },
];

const sort = computed({
  get: () => `${model.value.sortBy}:${model.value.sortOrder}`,
  set: (value: string) => {
    const [sortBy, sortOrder] = value.split(":") as [
      ServiceFilters["sortBy"],
      ServiceFilters["sortOrder"],
    ];
    model.value.sortBy = sortBy;
    model.value.sortOrder = sortOrder;
    model.value.page = 1;
  },
});
</script>

<style scoped lang="sass">
.services-filters
  padding: 16px 0 8px
</style>
