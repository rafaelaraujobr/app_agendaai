<template>
  <div class="relative-position">
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

    <q-infinite-scroll
      :disable="!hasMore || loading"
      :offset="180"
      @load="onLoadMore"
    >
      <q-list
        v-if="model.length"
        bordered
        separator
        class="bg-white rounded-borders overflow-hidden"
      >
        <Draggable
          v-model="model"
          item-key="id"
          handle=".service-drag-handle"
          :disabled="!reorderEnabled || reordering"
          :animation="200"
          ghost-class="service-item--ghost"
          drag-class="service-item--dragging"
          @end="emitReorder"
        >
          <template #item="{ element: service }">
            <q-item class="service-list-item q-py-md">
              <q-item-section v-if="reorderEnabled" side>
                <q-icon
                  name="mdi-drag"
                  color="grey-6"
                  size="24px"
                  class="service-drag-handle cursor-grab"
                >
                  <q-tooltip>Arraste para ordenar</q-tooltip>
                </q-icon>
              </q-item-section>

              <q-item-section avatar>
                <q-avatar rounded size="54px" color="grey-2">
                  <q-img
                    v-if="getServiceImage(service)"
                    :src="getServiceImage(service)!"
                    :alt="service.name"
                    fit="cover"
                  />
                  <q-icon
                    v-else
                    name="mdi-briefcase-outline"
                    color="grey-7"
                  />
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label class="text-weight-bold">
                  {{ service.name }}
                </q-item-label>
                <q-item-label caption>
                  {{ formatShowcaseCurrency(service.price) }} ·
                  {{ formatShowcaseDuration(service.durationMinutes) }}
                </q-item-label>
                <q-item-label caption class="q-mt-xs">
                  <q-badge
                    :color="service.isActive ? 'green-1' : 'grey-3'"
                    :text-color="service.isActive ? 'green-9' : 'grey-8'"
                    :label="service.isActive ? 'Ativo' : 'Inativo'"
                  />
                  <q-badge
                    v-if="service.highlight"
                    color="orange-1"
                    text-color="orange-9"
                    class="q-ml-xs"
                  >
                    <q-icon name="mdi-star" size="12px" class="q-mr-xs" />
                    Em destaque
                  </q-badge>
                </q-item-label>
              </q-item-section>

              <q-item-section side>
                <q-btn
                  icon="mdi-dots-vertical"
                  aria-label="Ações do serviço"
                  flat
                  round
                  dense
                  :loading="deletingId === service.id"
                >
                  <q-menu anchor="bottom right" self="top right">
                    <q-list style="min-width: 190px">
                      <q-item
                        v-close-popup
                        clickable
                        @click="$emit('edit', service)"
                      >
                        <q-item-section avatar>
                          <q-icon name="mdi-pencil-outline" />
                        </q-item-section>
                        <q-item-section>Editar</q-item-section>
                      </q-item>
                      <q-item
                        v-close-popup
                        clickable
                        @click="$emit('toggle', service)"
                      >
                        <q-item-section avatar>
                          <q-icon
                            :name="
                              service.isActive
                                ? 'mdi-eye-off-outline'
                                : 'mdi-eye-outline'
                            "
                          />
                        </q-item-section>
                        <q-item-section>
                          {{ service.isActive ? "Desativar" : "Ativar" }}
                        </q-item-section>
                      </q-item>
                      <q-item
                        v-if="!service.highlight && service.isActive"
                        v-close-popup
                        clickable
                        :disable="!canHighlight"
                        @click="$emit('highlight', service)"
                      >
                        <q-item-section avatar>
                          <q-icon name="mdi-star-outline" />
                        </q-item-section>
                        <q-item-section>Destacar</q-item-section>
                      </q-item>
                      <q-separator />
                      <q-item
                        v-close-popup
                        clickable
                        class="text-negative"
                        @click="$emit('delete', service)"
                      >
                        <q-item-section avatar>
                          <q-icon name="mdi-delete-outline" />
                        </q-item-section>
                        <q-item-section>Excluir</q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-btn>
              </q-item-section>
            </q-item>
          </template>
        </Draggable>
      </q-list>

      <template #loading>
        <div class="row justify-center q-my-md">
          <q-spinner color="primary" size="32px" />
        </div>
      </template>
    </q-infinite-scroll>

    <div v-if="!model.length && !loading">
      <q-card flat bordered class="text-center q-pa-xl rounded-borders">
        <q-icon
          name="mdi-briefcase-search-outline"
          size="64px"
          color="grey-5"
        />
        <div class="text-h6 q-mt-md">Nenhum serviço encontrado</div>
        <div class="text-body2 text-grey-7">
          Altere os filtros ou adicione um novo serviço.
        </div>
      </q-card>
    </div>

    <q-inner-loading :showing="loading && !model.length" />
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
  hasMore: boolean;
  canHighlight: boolean;
}>();

const emit = defineEmits<{
  edit: [service: ManagedService];
  delete: [service: ManagedService];
  toggle: [service: ManagedService];
  highlight: [service: ManagedService];
  reorder: [services: ManagedService[]];
  loadMore: [done: (stop?: boolean) => void];
}>();

const model = defineModel<ManagedService[]>({ required: true });

const getServiceImage = (service: ManagedService) =>
  service.imageUrl || service.illustration?.imageUrl || null;

const emitReorder = () => {
  emit("reorder", [...model.value]);
};

const onLoadMore = (
  _index: number,
  done: (stop?: boolean) => void,
) => {
  emit("loadMore", done);
};
</script>

<style scoped>
.service-list-item {
  min-height: 84px;
  transition: background-color 160ms ease;
}

.service-item--ghost {
  opacity: 0.45;
  background: #f3f4f6;
}

.service-item--dragging {
  background: white;
  box-shadow: 0 8px 24px rgb(0 0 0 / 14%);
}

.cursor-grab {
  cursor: grab;
  touch-action: none;
}
</style>
