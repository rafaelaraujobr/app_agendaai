<template>
  <q-card flat bordered class="rounded-borders q-mb-md">
    <q-card-section class="q-pa-md">
      <div class="row q-col-gutter-md items-center">
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
            label="Status"
            :options="statusOptions"
            outlined
            dense
            emit-value
            map-options
            bg-color="grey-1"
            dropdown-icon="mdi-chevron-down"
            @update:model-value="model.page = 1"
          />
        </div>

        <div class="col-12 col-sm-6 col-md-3">
          <q-select
            v-model="sort"
            label="Ordenar por"
            :options="sortOptions"
            outlined
            dense
            emit-value
            map-options
            bg-color="grey-1"
            dropdown-icon="mdi-chevron-down"
          />
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
