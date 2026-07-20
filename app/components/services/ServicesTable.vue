<template>
  <div class="relative-position q-mt-md">
    <q-banner
      v-if="model.length && !reorderEnabled"
      dense
      rounded
      class="bg-blue-1 text-primary q-mb-sm"
    >
      <template #avatar>
        <q-icon name="mdi-information-outline" />
      </template>
      Limpe a busca e ordene por “Posição” para reorganizar os serviços.
    </q-banner>

    <q-markup-table flat separator="horizontal" class="rounded-borders">
      <thead>
        <tr>
          <th class="text-center drag-column" aria-label="Ordenação"></th>
          <th class="text-left">Serviço</th>
          <th class="text-left">Preço</th>
          <th class="text-left">Duração</th>
          <th class="text-center">Posição</th>
          <th class="text-left">Status</th>
          <th class="text-right">Ações</th>
        </tr>
      </thead>

      <Draggable
        v-model="model"
        tag="tbody"
        item-key="id"
        handle=".service-drag-handle"
        :disabled="!reorderEnabled || reordering"
        :animation="200"
        ghost-class="service-row--ghost"
        drag-class="service-row--dragging"
        @end="emitReorder"
      >
        <template #item="{ element: service }">
          <tr>
            <td class="text-center drag-column">
              <q-icon
                name="mdi-drag"
                size="24px"
                :color="reorderEnabled ? 'grey-7' : 'grey-4'"
                :class="{ 'service-drag-handle cursor-grab': reorderEnabled }"
              >
                <q-tooltip>
                  {{
                    reorderEnabled
                      ? "Arraste para ordenar"
                      : "Ordene a listagem por posição para reorganizar"
                  }}
                </q-tooltip>
              </q-icon>
            </td>
            <td>
              <div class="row items-center no-wrap">
                <q-avatar rounded size="48px" color="grey-2" class="q-mr-md">
                  <q-img
                    v-if="getServiceImage(service)"
                    :src="getServiceImage(service)!"
                    :alt="service.name"
                    fit="cover"
                  />
                  <q-icon v-else name="mdi-briefcase-outline" color="grey-7" />
                </q-avatar>
                <div>
                  <div class="text-weight-medium">{{ service.name }}</div>
                  <div class="text-caption text-grey-7">
                    /{{ service.slug }}
                  </div>
                </div>
              </div>
            </td>
            <td class="text-weight-medium">
              {{ formatShowcaseCurrency(service.price) }}
            </td>
            <td>
              {{ formatShowcaseDuration(service.durationMinutes) }}
            </td>
            <td class="text-center">{{ service.position }}</td>
            <td>
              <q-toggle
                :model-value="service.isActive"
                color="positive"
                dense
                :aria-label="
                  service.isActive ? 'Desativar serviço' : 'Ativar serviço'
                "
                @update:model-value="$emit('toggle', service)"
              />
              <q-badge
                :color="service.isActive ? 'green-1' : 'grey-3'"
                :text-color="service.isActive ? 'green-9' : 'grey-8'"
                :label="service.isActive ? 'Ativo' : 'Inativo'"
              />
            </td>
            <td class="text-right">
              <q-btn
                icon="mdi-pencil-outline"
                aria-label="Editar serviço"
                flat
                round
                dense
                color="primary"
                @click="$emit('edit', service)"
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
                :loading="deletingId === service.id"
                @click="$emit('delete', service)"
              >
                <q-tooltip>
                  {{
                    service.appointmentCount
                      ? "Possui agendamentos: desative em vez de excluir"
                      : "Excluir"
                  }}
                </q-tooltip>
              </q-btn>
            </td>
          </tr>
        </template>
      </Draggable>

      <tbody v-if="!model.length && !loading">
        <tr>
          <td colspan="7" class="text-center text-grey-7 q-pa-xl">
            Nenhum serviço encontrado com os filtros selecionados.
          </td>
        </tr>
      </tbody>
    </q-markup-table>

    <q-inner-loading :showing="loading">
      <q-spinner color="primary" size="42px" />
    </q-inner-loading>
  </div>
</template>

<script setup lang="ts">
import Draggable from "vuedraggable";
import type { ManagedService } from "~/types/service";
import {
  formatShowcaseCurrency,
  formatShowcaseDuration,
} from "~/composables/usePublicBusiness";

defineProps<{
  loading: boolean;
  deletingId: string | null;
  reorderEnabled: boolean;
  reordering: boolean;
}>();

const emit = defineEmits<{
  edit: [service: ManagedService];
  delete: [service: ManagedService];
  toggle: [service: ManagedService];
  reorder: [services: ManagedService[]];
}>();

const model = defineModel<ManagedService[]>({ required: true });

const getServiceImage = (service: ManagedService) =>
  service.imageUrl || service.illustration?.imageUrl || null;

const emitReorder = () => {
  emit("reorder", [...model.value]);
};
</script>

<style scoped>
.drag-column {
  width: 48px;
}

.service-row--ghost {
  opacity: 0.45;
  background: #f3f4f6;
}

.service-row--dragging {
  background: white;
  box-shadow: 0 8px 24px rgb(0 0 0 / 14%);
}

.cursor-grab {
  cursor: grab;
  touch-action: none;
}
</style>
