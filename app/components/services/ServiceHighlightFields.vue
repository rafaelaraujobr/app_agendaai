<template>
  <div class="highlight-fields">
    <q-toggle
      v-model="model.enabled"
      label="Adicionar aos destaques"
      color="secondary"
      :disable="disableToggle"
    >
      <q-tooltip v-if="disableToggle">
        Limite de {{ maxHighlights }} destaques atingido
      </q-tooltip>
    </q-toggle>

    <q-slide-transition>
      <div v-if="model.enabled" class="q-mt-md">
        <q-card flat bordered class="rounded-borders bg-grey-1">
          <q-card-section>
            <div class="text-subtitle2 text-weight-medium q-mb-sm">
              Configurações do destaque
            </div>
            <div class="text-caption text-grey-7 q-mb-md">
              Campos em branco utilizam automaticamente o título, a descrição e a
              imagem do serviço.
            </div>

            <div class="row q-col-gutter-md">
              <div class="col-12">
                <label class="text-weight-medium text-subtitle2 q-mb-xs">
                  Título do destaque
                </label>
                <q-input
                  v-model="model.title"
                  outlined
                  dense
                  bg-color="white"
                  maxlength="150"
                  counter
                  placeholder="Usa o nome do serviço se vazio"
                />
              </div>

              <div class="col-12">
                <label class="text-weight-medium text-subtitle2 q-mb-xs">
                  Descrição do destaque
                </label>
                <q-input
                  v-model="model.description"
                  type="textarea"
                  rows="2"
                  outlined
                  bg-color="white"
                  maxlength="500"
                  counter
                  placeholder="Usa a descrição do serviço se vazio"
                />
              </div>

              <div class="col-12">
                <label class="text-weight-medium text-subtitle2 q-mb-xs">
                  Imagem do destaque
                </label>
                <div class="row items-center q-gutter-sm">
                  <q-avatar rounded size="72px" color="grey-2">
                    <q-img
                      v-if="previewImage"
                      :src="previewImage"
                      fit="cover"
                      alt="Prévia do destaque"
                    />
                    <q-icon v-else name="mdi-image-outline" color="grey-6" />
                  </q-avatar>
                  <div class="col">
                    <q-file
                      v-model="imageFileModel"
                      label="Enviar imagem personalizada"
                      outlined
                      dense
                      bg-color="white"
                      accept="image/*"
                      clearable
                      @update:model-value="onImageSelected"
                    >
                      <template #prepend>
                        <q-icon name="mdi-cloud-upload-outline" />
                      </template>
                    </q-file>
                    <div class="text-caption text-grey-7 q-mt-xs">
                      Se não informar, será usada a imagem do serviço.
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-12 col-sm-6">
                <label class="text-weight-medium text-subtitle2 q-mb-xs">
                  Exibir a partir de
                </label>
                <q-input
                  v-model="model.startsAt"
                  type="datetime-local"
                  outlined
                  dense
                  bg-color="white"
                  stack-label
                />
              </div>

              <div class="col-12 col-sm-6">
                <label class="text-weight-medium text-subtitle2 q-mb-xs">
                  Exibir até
                </label>
                <q-input
                  v-model="model.endsAt"
                  type="datetime-local"
                  outlined
                  dense
                  bg-color="white"
                  stack-label
                  :rules="[validateEndDate]"
                />
              </div>

              <div class="col-12 col-sm-6">
                <label class="text-weight-medium text-subtitle2 q-mb-xs">
                  Posição na página pública
                </label>
                <q-select
                  v-model="model.position"
                  :options="positionOptions"
                  outlined
                  dense
                  bg-color="white"
                  emit-value
                  map-options
                  dropdown-icon="mdi-chevron-down"
                  placeholder="Automática"
                  clearable
                />
              </div>

              <div class="col-12 col-sm-6 flex items-end">
                <q-toggle
                  v-model="model.isActive"
                  label="Destaque ativo"
                  color="positive"
                />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </q-slide-transition>
  </div>
</template>

<script setup lang="ts">
import type { ServiceHighlightForm } from "~/types/service";

const props = defineProps<{
  serviceImageUrl: string | null;
  maxHighlights: number;
  disableToggle?: boolean;
}>();

const model = defineModel<ServiceHighlightForm>({ required: true });

const imageFileModel = ref<File | null>(null);
const localPreviewUrl = ref<string | null>(null);

const positionOptions = [
  { label: "Posição 1", value: 0 },
  { label: "Posição 2", value: 1 },
  { label: "Posição 3", value: 2 },
  { label: "Posição 4", value: 3 },
  { label: "Posição 5", value: 4 },
];

const previewImage = computed(() => {
  if (localPreviewUrl.value) return localPreviewUrl.value;
  if (model.value.imageUrl) return model.value.imageUrl;
  return props.serviceImageUrl;
});

const validateEndDate = (value: string) =>
  !value ||
  !model.value.startsAt ||
  new Date(value) > new Date(model.value.startsAt) ||
  "A data final deve ser posterior à inicial";

const onImageSelected = (file: File | null) => {
  if (localPreviewUrl.value) {
    URL.revokeObjectURL(localPreviewUrl.value);
    localPreviewUrl.value = null;
  }

  model.value.imageFile = file;

  if (file) {
    localPreviewUrl.value = URL.createObjectURL(file);
  }
};

watch(
  () => model.value.enabled,
  (enabled) => {
    if (!enabled) {
      imageFileModel.value = null;
      if (localPreviewUrl.value) {
        URL.revokeObjectURL(localPreviewUrl.value);
        localPreviewUrl.value = null;
      }
    }
  },
);

onBeforeUnmount(() => {
  if (localPreviewUrl.value) URL.revokeObjectURL(localPreviewUrl.value);
});
</script>
