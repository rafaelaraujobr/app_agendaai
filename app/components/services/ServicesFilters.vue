<template>
  <q-card flat>
    <q-card-section class="q-pa-md">
      <div class="row q-col-gutter-md items-center justify-between">
        <div class="col-12 col-md">
          <q-input
            v-model="model.search"
            label="Buscar serviço"
            placeholder="Nome ou descrição"
            outlined
            dense
            clearable
            bg-color="grey-1"
            debounce="400"
            style="max-width: 400px"
            @update:model-value="model.page = 1"
          >
            <template #prepend>
              <q-icon name="mdi-magnify" />
            </template>
          </q-input>
        </div>
      </div>

      <div class="row items-center q-gutter-sm q-mt-sm">
        <q-chip
          icon="mdi-check-circle-outline"
          color="green-1"
          text-color="green-9"
          dense
        >
          {{ activeCount }} ativo(s)
        </q-chip>
        <q-chip icon="mdi-format-list-bulleted" color="grey-2" dense>
          {{ total }} serviço(s)
        </q-chip>
      </div>
    </q-card-section>
  </q-card>
  <div class="row justify-between">
    <q-tabs v-model="model.status" inline-label align="left" no-caps>
      <q-tab name="all" label="Todos" />
      <q-tab name="active" label="Ativos" />
      <q-tab name="inactive" label="Inativos" />
    </q-tabs>
    <q-select
      v-model="sort"
      label="Ordenar por"
      :options="sortOptions"
      borderless
      style="min-width: 140px"
      dense
      emit-value
      map-options
      dropdown-icon="mdi-chevron-down"
    />
  </div>
  <q-separator />
</template>

<script setup lang="ts">
import type { ServiceFilters } from "~/types/service";

defineProps<{
  total: number;
  activeCount: number;
}>();

const model = defineModel<ServiceFilters>({ required: true });

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
