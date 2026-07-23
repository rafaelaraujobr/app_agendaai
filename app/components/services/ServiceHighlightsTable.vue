<template>
  <div class="relative-position">
    <q-banner
      v-if="model.length"
      dense
      rounded
      class="bg-orange-1 text-orange-10 q-ma-md q-mb-none"
    >
      <template #avatar>
        <q-icon name="mdi-star-outline" color="orange-8" />
      </template>
      Arraste os itens para definir a ordem de exibição na página pública.
    </q-banner>

    <q-list v-if="model.length" separator class="highlights-list q-pa-md q-pt-sm">
      <Draggable
        v-model="model"
        item-key="id"
        handle=".highlight-drag-handle"
        :disabled="reordering"
        :animation="200"
        ghost-class="highlight-item--ghost"
        @end="emitReorder"
      >
        <template #item="{ element: highlight }">
          <q-item class="highlight-item q-py-md rounded-borders q-mb-sm">
            <q-item-section side>
              <q-icon
                name="mdi-drag"
                color="grey-6"
                size="20px"
                class="highlight-drag-handle cursor-grab"
              />
            </q-item-section>

            <q-item-section avatar>
              <q-avatar rounded size="56px" color="grey-2">
                <q-img
                  v-if="getHighlightImage(highlight)"
                  :src="getHighlightImage(highlight)!"
                  :alt="highlight.title"
                  fit="cover"
                />
                <q-icon v-else name="mdi-star-outline" color="grey-6" />
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-weight-medium">
                {{ highlight.title }}
              </q-item-label>
              <q-item-label caption>
                Serviço: {{ highlight.service.name }}
              </q-item-label>
              <q-item-label caption class="q-mt-xs">
                <q-badge
                  :color="highlight.isActive ? 'green-1' : 'grey-3'"
                  :text-color="highlight.isActive ? 'green-9' : 'grey-8'"
                  :label="highlight.isActive ? 'Ativo' : 'Inativo'"
                />
                <q-badge
                  color="orange-1"
                  text-color="orange-9"
                  class="q-ml-xs"
                >
                  Posição {{ highlight.position + 1 }}
                </q-badge>
                <span v-if="formatPeriod(highlight)" class="q-ml-sm text-grey-7">
                  {{ formatPeriod(highlight) }}
                </span>
              </q-item-label>
            </q-item-section>

            <q-item-section side>
              <div class="row no-wrap">
                <q-btn
                  icon="mdi-pencil-outline"
                  flat
                  round
                  dense
                  color="primary"
                  aria-label="Editar destaque"
                  @click="$emit('edit', highlight)"
                >
                  <q-tooltip>Editar</q-tooltip>
                </q-btn>
                <q-btn
                  icon="mdi-delete-outline"
                  flat
                  round
                  dense
                  color="negative"
                  aria-label="Remover destaque"
                  :loading="removingId === highlight.id"
                  @click="$emit('remove', highlight)"
                >
                  <q-tooltip>Remover destaque</q-tooltip>
                </q-btn>
              </div>
            </q-item-section>
          </q-item>
        </template>
      </Draggable>
    </q-list>

    <div
      v-else-if="!loading"
      class="column items-center text-center text-grey-7 q-pa-xl"
    >
      <q-icon name="mdi-star-outline" size="56px" color="grey-5" />
      <div class="text-subtitle1 q-mt-md">Nenhum destaque configurado</div>
      <div class="text-body2 q-mt-xs">
        Adicione destaques na aba Serviços ou ao editar um serviço.
      </div>
    </div>

    <q-inner-loading :showing="loading">
      <q-spinner color="primary" size="42px" />
    </q-inner-loading>
  </div>
</template>

<script setup lang="ts">
import Draggable from "vuedraggable";
import type { ServiceHighlight } from "~/types/service";

defineProps<{
  loading: boolean;
  removingId: string | null;
  reordering: boolean;
}>();

const emit = defineEmits<{
  edit: [highlight: ServiceHighlight];
  remove: [highlight: ServiceHighlight];
  reorder: [highlights: ServiceHighlight[]];
}>();

const model = defineModel<ServiceHighlight[]>({ required: true });

const getHighlightImage = (highlight: ServiceHighlight) =>
  highlight.imageUrl ||
  highlight.service.imageUrl ||
  highlight.service.illustration?.imageUrl ||
  null;

const formatPeriod = (highlight: ServiceHighlight) => {
  if (!highlight.startsAt && !highlight.endsAt) return "";
  const formatter = new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
  if (highlight.startsAt && highlight.endsAt) {
    return `${formatter.format(new Date(highlight.startsAt))} até ${formatter.format(
      new Date(highlight.endsAt),
    )}`;
  }
  if (highlight.startsAt) {
    return `A partir de ${formatter.format(new Date(highlight.startsAt))}`;
  }
  return `Até ${formatter.format(new Date(highlight.endsAt!))}`;
};

const emitReorder = () => {
  emit("reorder", [...model.value]);
};
</script>

<style scoped lang="sass">
.highlight-item
  border: 1px solid rgba(0, 0, 0, 0.06)
  background: white

.highlight-item--ghost
  opacity: 0.45
  background: #f5f5f5

.cursor-grab
  cursor: grab
  touch-action: none
</style>
