<template>
  <div class="relative-position">
    <q-markup-table
      flat
      separator="horizontal"
      class="services-table rounded-borders"
    >
      <thead>
        <tr>
          <th class="text-center drag-column" aria-label="Ordenação"></th>
          <th class="text-left">Serviço</th>
          <th class="text-left">Preço</th>
          <th class="text-left">Duração</th>
          <th class="text-center">Status</th>
          <th class="text-right actions-column">Ações</th>
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
                name="mdi-drag-vertical"
                size="20px"
                :color="reorderEnabled ? 'grey-6' : 'grey-4'"
                :class="{ 'service-drag-handle cursor-grab': reorderEnabled }"
              />
            </td>

            <td class="service-column">
              <div class="row items-start no-wrap q-gutter-md">
                <q-avatar rounded size="56px" color="grey-2">
                  <q-img
                    v-if="getServiceImage(service)"
                    :src="getServiceImage(service)!"
                    :alt="service.name"
                    fit="cover"
                  />
                  <q-icon v-else name="mdi-briefcase-outline" color="grey-6" />
                </q-avatar>

                <div class="col min-width-0">
                  <div class="text-weight-medium text-body1">
                    {{ service.name }}
                  </div>
                  <div
                    v-if="service.description"
                    class="text-caption text-grey-7 q-mt-xs ellipsis-2-lines"
                  >
                    {{ service.description }}
                  </div>
                  <div class="row items-center q-gutter-xs q-mt-sm">
                    <q-badge
                      :color="service.isActive ? 'green-1' : 'grey-3'"
                      :text-color="service.isActive ? 'green-9' : 'grey-8'"
                      :label="service.isActive ? 'Ativo' : 'Inativo'"
                    />
                    <q-badge
                      v-if="service.highlight"
                      color="orange-1"
                      text-color="orange-9"
                      class="highlight-badge"
                    >
                      <q-icon name="mdi-star" size="14px" class="q-mr-xs" />
                      Em destaque
                    </q-badge>
                    <q-btn
                      v-else-if="service.isActive"
                      flat
                      dense
                      no-caps
                      size="sm"
                      class="highlight-action"
                      :disable="!canHighlight"
                      @click="$emit('highlight', service)"
                    >
                      <q-icon name="mdi-star-outline" size="16px" class="q-mr-xs" />
                      Destacar
                      <q-tooltip v-if="!canHighlight">
                        Limite de destaques atingido
                      </q-tooltip>
                    </q-btn>
                  </div>
                </div>
              </div>
            </td>

            <td class="text-weight-medium">
              {{ formatShowcaseCurrency(service.price) }}
            </td>

            <td>{{ formatShowcaseDuration(service.durationMinutes) }}</td>

            <td class="text-center">
              <q-toggle
                :model-value="service.isActive"
                color="positive"
                dense
                :aria-label="
                  service.isActive ? 'Desativar serviço' : 'Ativar serviço'
                "
                @update:model-value="$emit('toggle', service)"
              />
            </td>

            <td class="text-right actions-column">
              <q-btn
                icon="mdi-dots-vertical"
                flat
                round
                dense
                color="grey-7"
                aria-label="Ações do serviço"
              >
                <q-menu anchor="bottom right" self="top right">
                  <q-list style="min-width: 180px">
                    <q-item v-close-popup clickable @click="$emit('edit', service)">
                      <q-item-section side>
                        <q-icon name="mdi-pencil-outline" />
                      </q-item-section>
                      <q-item-section>Editar</q-item-section>
                    </q-item>
                    <q-item
                      v-if="!service.highlight && service.isActive"
                      v-close-popup
                      clickable
                      :disable="!canHighlight"
                      @click="$emit('highlight', service)"
                    >
                      <q-item-section side>
                        <q-icon name="mdi-star-outline" />
                      </q-item-section>
                      <q-item-section>Destacar</q-item-section>
                    </q-item>
                    <q-separator />
                    <q-item
                      v-close-popup
                      clickable
                      class="text-negative"
                      :disable="service.appointmentCount > 0"
                      @click="$emit('delete', service)"
                    >
                      <q-item-section side>
                        <q-icon name="mdi-delete-outline" color="negative" />
                      </q-item-section>
                      <q-item-section>Excluir</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </td>
          </tr>
        </template>
      </Draggable>

      <tbody v-if="!model.length && !loading">
        <tr>
          <td colspan="6" class="text-center text-grey-7 q-pa-xl">
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
  canHighlight: boolean;
}>();

const emit = defineEmits<{
  edit: [service: ManagedService];
  delete: [service: ManagedService];
  toggle: [service: ManagedService];
  highlight: [service: ManagedService];
  reorder: [services: ManagedService[]];
}>();

const model = defineModel<ManagedService[]>({ required: true });

const getServiceImage = (service: ManagedService) =>
  service.imageUrl || service.illustration?.imageUrl || null;

const emitReorder = () => {
  emit("reorder", [...model.value]);
};
</script>

<style scoped lang="sass">
.services-table
  background: white

.drag-column
  width: 40px

.actions-column
  width: 72px

.service-column
  min-width: 280px

.highlight-badge
  font-weight: 500

.highlight-action
  color: #6b7280
  padding: 0 8px
  min-height: 24px

.ellipsis-2-lines
  display: -webkit-box
  -webkit-line-clamp: 2
  -webkit-box-orient: vertical
  overflow: hidden

.service-row--ghost
  opacity: 0.45
  background: #f3f4f6

.service-row--dragging
  background: white
  box-shadow: 0 8px 24px rgb(0 0 0 / 14%)

.cursor-grab
  cursor: grab
  touch-action: none
</style>
