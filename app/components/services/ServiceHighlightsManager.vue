<template>
  <q-card flat bordered class="rounded-borders q-mb-lg">
    <q-card-section class="row items-center q-col-gutter-md">
      <div class="col">
        <div class="row items-center q-gutter-sm">
          <q-icon name="mdi-view-carousel-outline" color="primary" size="24px" />
          <div class="text-h6">Carrossel de promoções</div>
          <q-badge
            :label="`${highlights.length}/${maxHighlights}`"
            color="grey-3"
            text-color="grey-9"
          />
        </div>
        <div class="text-body2 text-grey-7">
          Escolha até cinco serviços para destacar na página pública.
        </div>
      </div>
      <div class="col-auto">
        <q-btn
          label="Adicionar destaque"
          icon="mdi-plus"
          no-caps
          unelevated
          color="primary"
          :disable="highlights.length >= maxHighlights || isLoading"
          @click="openCreate"
        />
      </div>
    </q-card-section>

    <q-separator />

    <q-list v-if="highlights.length" separator>
      <Draggable
        v-model="highlights"
        item-key="id"
        handle=".highlight-drag-handle"
        :animation="200"
        ghost-class="highlight-item--ghost"
        @end="reorderHighlights([...highlights])"
      >
        <template #item="{ element: highlight }">
          <q-item class="q-py-md">
            <q-item-section side>
              <q-icon
                name="mdi-drag"
                color="grey-6"
                size="24px"
                class="highlight-drag-handle cursor-grab"
              >
                <q-tooltip>Arraste para ordenar</q-tooltip>
              </q-icon>
            </q-item-section>

            <q-item-section avatar>
              <q-avatar rounded size="58px" color="grey-2">
                <q-img
                  v-if="highlight.imageUrl"
                  :src="highlight.imageUrl"
                  :alt="highlight.title"
                  fit="cover"
                />
                <q-icon v-else name="mdi-sale-outline" color="grey-7" />
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-weight-bold">
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
                <span v-if="formatPeriod(highlight)" class="q-ml-sm">
                  {{ formatPeriod(highlight) }}
                </span>
              </q-item-label>
            </q-item-section>

            <q-item-section side>
              <div class="row no-wrap">
                <q-btn
                  icon="mdi-pencil-outline"
                  aria-label="Editar destaque"
                  flat
                  round
                  color="primary"
                  @click="openEdit(highlight)"
                >
                  <q-tooltip>Editar</q-tooltip>
                </q-btn>
                <q-btn
                  icon="mdi-delete-outline"
                  aria-label="Remover destaque"
                  flat
                  round
                  color="negative"
                  :loading="deletingId === highlight.id"
                  @click="confirmDelete(highlight)"
                >
                  <q-tooltip>Remover</q-tooltip>
                </q-btn>
              </div>
            </q-item-section>
          </q-item>
        </template>
      </Draggable>
    </q-list>

    <q-card-section
      v-else-if="!isLoading"
      class="column items-center text-center text-grey-7 q-pa-xl"
    >
      <q-icon name="mdi-view-carousel-outline" size="52px" color="grey-5" />
      <div class="text-subtitle1 q-mt-sm">Nenhum destaque configurado</div>
      <div class="text-body2">
        Adicione serviços para exibi-los no carrossel da página pública.
      </div>
    </q-card-section>

    <q-inner-loading :showing="isLoading" />
  </q-card>

  <q-dialog v-model="dialogOpen" persistent>
    <q-card style="width: 680px; max-width: 95vw">
      <q-form @submit.prevent="handleSave">
        <q-card-section class="row items-center">
          <div class="text-h6">
            {{ editingId ? "Editar destaque" : "Adicionar destaque" }}
          </div>
          <q-space />
          <q-btn v-close-popup icon="mdi-close" flat round dense />
        </q-card-section>
        <q-separator />

        <q-card-section class="q-gutter-y-md scroll" style="max-height: 70vh">
          <q-select
            v-model="form.serviceId"
            :options="serviceOptions"
            label="Serviço"
            outlined
            emit-value
            map-options
            dropdown-icon="mdi-chevron-down"
            bg-color="grey-1"
            :rules="[(value) => Boolean(value) || 'Selecione um serviço']"
          />

          <q-input
            v-model="form.title"
            label="Título do destaque"
            outlined
            bg-color="grey-1"
            maxlength="150"
            counter
            :rules="[
              (value) =>
                value.trim().length >= 2 || 'Informe um título válido',
            ]"
          />

          <q-input
            v-model="form.description"
            label="Descrição"
            type="textarea"
            autogrow
            outlined
            bg-color="grey-1"
            maxlength="500"
            counter
          />

          <q-input
            v-model="form.imageUrl"
            label="URL da imagem personalizada (opcional)"
            hint="Se não informar, será utilizada a imagem do serviço."
            outlined
            bg-color="grey-1"
            clearable
          />

          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-6">
              <q-input
                v-model="form.startsAt"
                label="Exibir a partir de"
                type="datetime-local"
                outlined
                bg-color="grey-1"
                stack-label
              />
            </div>
            <div class="col-12 col-sm-6">
              <q-input
                v-model="form.endsAt"
                label="Exibir até"
                type="datetime-local"
                outlined
                bg-color="grey-1"
                stack-label
                :rules="[validateEndDate]"
              />
            </div>
          </div>

          <q-toggle
            v-model="form.isActive"
            label="Destaque ativo"
            color="positive"
          />
        </q-card-section>

        <q-separator />
        <q-card-actions align="right" class="q-pa-md">
          <q-btn v-close-popup label="Cancelar" flat no-caps />
          <q-btn
            label="Salvar destaque"
            type="submit"
            color="primary"
            unelevated
            no-caps
            :loading="isSaving"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import Draggable from "vuedraggable";
import type {
  ServiceHighlight,
  ServiceHighlightForm,
} from "~/types/service";

const $q = useQuasar();
const {
  highlights,
  candidateServices,
  maxHighlights,
  isLoading,
  isSaving,
  deletingId,
  loadHighlights,
  createForm,
  saveHighlight,
  reorderHighlights,
  deleteHighlight,
} = useServiceHighlights();

const dialogOpen = ref(false);
const editingId = ref<string | null>(null);
const form = ref<ServiceHighlightForm>(createForm());

const serviceOptions = computed(() =>
  candidateServices.value.map((service) => ({
    label: service.name,
    value: service.id,
  })),
);

watch(
  () => form.value.serviceId,
  (serviceId) => {
    if (!serviceId || form.value.title.trim()) return;
    const service = candidateServices.value.find(
      (candidate) => candidate.id === serviceId,
    );
    if (service) form.value.title = service.name;
  },
);

const openCreate = () => {
  editingId.value = null;
  form.value = createForm();
  dialogOpen.value = true;
};

const openEdit = (highlight: ServiceHighlight) => {
  editingId.value = highlight.id;
  form.value = createForm(highlight);
  dialogOpen.value = true;
};

const validateEndDate = (value: string) =>
  !value ||
  !form.value.startsAt ||
  new Date(value) > new Date(form.value.startsAt) ||
  "A data final deve ser posterior à inicial";

const handleSave = async () => {
  if (await saveHighlight(form.value, editingId.value)) {
    dialogOpen.value = false;
  }
};

const confirmDelete = (highlight: ServiceHighlight) => {
  $q.dialog({
    title: "Remover destaque",
    message: `Deseja remover “${highlight.title}” do carrossel?`,
    cancel: { label: "Cancelar", flat: true, noCaps: true },
    ok: { label: "Remover", color: "negative", noCaps: true },
  }).onOk(() => deleteHighlight(highlight));
};

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

onMounted(loadHighlights);
</script>

<style scoped lang="sass">
.highlight-item--ghost
  opacity: 45%
  background: #f5f5f5

.cursor-grab
  cursor: grab
  touch-action: none
</style>
