<template>
  <q-table
    :rows="services"
    :columns="columns"
    row-key="id"
    flat
    bordered
    hide-bottom
    :loading="loading"
    class="rounded-borders"
  >
    <template #body-cell-service="props">
      <q-td :props="props">
        <div class="row items-center no-wrap">
          <q-avatar rounded size="48px" color="grey-2" class="q-mr-md">
            <q-img
              v-if="getServiceImage(props.row)"
              :src="getServiceImage(props.row)!"
              :alt="props.row.name"
              fit="cover"
            />
            <q-icon v-else name="mdi-briefcase-outline" color="grey-7" />
          </q-avatar>
          <div>
            <div class="text-weight-medium">{{ props.row.name }}</div>
            <div class="text-caption text-grey-7">
              /{{ props.row.slug }}
            </div>
          </div>
        </div>
      </q-td>
    </template>

    <template #body-cell-price="props">
      <q-td :props="props" class="text-weight-medium">
        {{ formatShowcaseCurrency(props.row.price) }}
      </q-td>
    </template>

    <template #body-cell-duration="props">
      <q-td :props="props">
        {{ formatShowcaseDuration(props.row.durationMinutes) }}
      </q-td>
    </template>

    <template #body-cell-status="props">
      <q-td :props="props">
        <q-toggle
          :model-value="props.row.isActive"
          color="positive"
          dense
          :aria-label="
            props.row.isActive ? 'Desativar serviço' : 'Ativar serviço'
          "
          @update:model-value="$emit('toggle', props.row)"
        />
        <q-badge
          :color="props.row.isActive ? 'green-1' : 'grey-3'"
          :text-color="props.row.isActive ? 'green-9' : 'grey-8'"
          :label="props.row.isActive ? 'Ativo' : 'Inativo'"
        />
      </q-td>
    </template>

    <template #body-cell-actions="props">
      <q-td :props="props">
        <q-btn
          icon="mdi-pencil-outline"
          aria-label="Editar serviço"
          flat
          round
          dense
          color="primary"
          @click="$emit('edit', props.row)"
        >
          <q-tooltip>Editar</q-tooltip>
        </q-btn>
        <q-btn
          icon="mdi-delete-outline"
          aria-label="Excluir serviço"
          flat
          round
          dense
          color="negative"
          :loading="deletingId === props.row.id"
          @click="$emit('delete', props.row)"
        >
          <q-tooltip>
            {{
              props.row.appointmentCount
                ? "Possui agendamentos: desative em vez de excluir"
                : "Excluir"
            }}
          </q-tooltip>
        </q-btn>
      </q-td>
    </template>

    <template #no-data>
      <div class="full-width text-center text-grey-7 q-pa-xl">
        Nenhum serviço encontrado com os filtros selecionados.
      </div>
    </template>
  </q-table>
</template>

<script setup lang="ts">
import type { QTableColumn } from "quasar";
import type { ManagedService } from "~/types/service";
import {
  formatShowcaseCurrency,
  formatShowcaseDuration,
} from "~/composables/usePublicBusiness";

defineProps<{
  services: ManagedService[];
  loading: boolean;
  deletingId: string | null;
}>();

defineEmits<{
  edit: [service: ManagedService];
  delete: [service: ManagedService];
  toggle: [service: ManagedService];
}>();

const columns: QTableColumn<ManagedService>[] = [
  {
    name: "service",
    label: "Serviço",
    field: "name",
    align: "left",
    sortable: false,
  },
  {
    name: "price",
    label: "Preço",
    field: "price",
    align: "left",
  },
  {
    name: "duration",
    label: "Duração",
    field: "durationMinutes",
    align: "left",
  },
  {
    name: "position",
    label: "Posição",
    field: "position",
    align: "center",
  },
  {
    name: "status",
    label: "Status",
    field: "isActive",
    align: "left",
  },
  {
    name: "actions",
    label: "Ações",
    field: "id",
    align: "right",
  },
];

const getServiceImage = (service: ManagedService) =>
  service.imageUrl || service.illustration?.imageUrl || null;
</script>
