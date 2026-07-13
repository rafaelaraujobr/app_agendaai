<template>
  <div class="q-mb-lg">
    <q-card v-if="croppedPreviewUrl" flat class="preview-card" bordered>
      <q-card-section>
        <q-img
          :src="croppedPreviewUrl"
          class="cursor-pointer rounded-borders bg-grey-2"
          fit="contain"
          style="width: 100%; height: 100%"
          @click="dialogPreview = true"
        >
          <div class="preview-overlay absolute-full flex flex-center">
            <q-icon name="eva-expand-outline" size="2rem" color="white" />
          </div>
        </q-img>
      </q-card-section>
      <q-card-actions align="right" class="q-pa-sm">
        <q-btn
          flat
          no-caps
          icon="mdi-crop"
          label="Recortar"
          @click="handleReCrop"
        />
        <q-btn
          flat
          no-caps
          icon="mdi-refresh"
          label="Trocar"
          @click="handleLoadImage"
        />
        <q-btn
          no-caps
          dense
          icon="mdi-delete"
          class="absolute-top-right q-mt-xs"
          flat
          text-color="negative"
          color="white"
          @click="clearImage"
        />
      </q-card-actions>
    </q-card>

    <q-card
      v-else
      flat
      class="flex flex-center cursor-pointer drop-zone bg-grey-2"
      :class="{ 'drop-zone--active': isDragging }"
      @click="handleLoadImage"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
    >
      <q-card-section class="text-center full-width">
        <q-btn color="primary" flat dense @click.stop="handleLoadImage">
          <q-icon name="mdi-image" size="5rem" color="grey-4" />
          <q-avatar
            color="grey-6"
            class="absolute-bottom-right"
            size="md"
            font-size="42px"
            text-color="white"
          >
            <q-icon name="mdi-plus" size="1rem" />
          </q-avatar>
        </q-btn>
        <div class="text-subtitle2 text-weight-medium q-mt-xs">
          Enviar {{ label }}
        </div>
        <div class="text-caption text-grey-6">
          PNG, JPG ou SVG (até {{ humanStorageSize(maxSize) }})
        </div>
      </q-card-section>
    </q-card>
    <div v-if="isUrlInput">
      <div class="row items-center q-my-sm">
        <div class="col-5"><q-separator /></div>
        <div class="col-2 text-center text-grey-6 text-subtitle2">Ou</div>
        <div class="col-5"><q-separator /></div>
      </div>
      <label class="text-weight-medium text-subtitle2 q-mb-xs">
        URL da imagem
      </label>
      <q-input
        v-model="urlImage"
        class="q-mt-xs"
        type="url"
        outlined
        bg-color="white"
        dense
        placeholder="https://example.com/image.png"
        clearable
        clear-icon="mdi-close"
        @clear="clearUrlImage"
      >
        <template #append>
          <q-btn
            icon="mdi-content-paste"
            dense
            flat
            color="primary"
            :loading="urlLoading"
            @click="handlePasteImage"
          >
            <q-tooltip>Cole a URL da imagem</q-tooltip>
          </q-btn>
        </template>
        <template #after>
          <q-btn
            icon="mdi-link"
            dense
            padding="sm md"
            color="primary"
            :loading="urlLoading"
            @click="handleLoadImageFromUrl"
          >
            <q-tooltip>Carregar imagem da URL</q-tooltip>
          </q-btn>
        </template>
      </q-input>
    </div>
    <q-dialog v-model="dialogPreview" flat>
      <q-card flat style="width: 640px; max-width: 95vw; max-height: 90vh">
        <q-toolbar>
          <q-toolbar-title class="text-body1">
            Visualizar imagem
          </q-toolbar-title>
          <q-btn icon="close" flat round dense @click="dialogPreview = false" />
        </q-toolbar>
        <q-card-section>
          <q-img
            :src="croppedPreviewUrl"
            fit="contain"
            style="width: 100%; height: 100%"
          />
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-file
      v-show="false"
      ref="fileInputRef"
      v-model="fileModel"
      accept=".png,.jpg,.jpeg,.webp"
      :max-file-size="maxSize"
      @update:model-value="handleFileSelected"
      @rejected="handleRejected"
    />

    <q-dialog v-model="dialogCropper" persistent>
      <q-card style="width: 640px; max-width: 98vw" flat>
        <q-toolbar>
          <q-toolbar-title class="text-body1"> Ajustar imagem </q-toolbar-title>
          <q-btn icon="close" flat round dense @click="handleCancel" />
        </q-toolbar>
        <q-card-section>
          <cropper
            ref="cropperRef"
            class="cropper"
            :src="imgSrc"
            :stencil-props="{ aspectRatio: props.aspectRatio }"
            image-restriction="stencil"
            @change="handleCropChange"
          />
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Cancelar" no-caps @click="handleCancel" />
          <q-btn
            label="Aplicar"
            no-caps
            padding="sm lg"
            color="primary"
            :loading="saving"
            @click="handleSaveImage"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { Cropper } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";
import { format } from "quasar";
const { humanStorageSize } = format;
const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp"];
const $q = useQuasar();
const model = defineModel<File | null>({ default: null });
const props = defineProps({
  aspectRatio: {
    type: Number,
    default: 3,
  },
  label: {
    type: String,
    default: "imagem",
  },
  maxFileSize: {
    type: Number,
    default: 5,
  },
  isUrlInput: {
    type: Boolean,
    default: false,
  },
});

const maxSize = computed(() => {
  return props.maxFileSize * 1024 * 1024;
});

const fileModel = ref<File | null>(null);
const fileInputRef = ref<{ pickFiles: () => void } | null>(null);
const dialogCropper = ref(false);
const dialogPreview = ref(false);
const imgSrc = ref<string>("");
const isDragging = ref(false);
const saving = ref(false);
const cropperRef = ref<InstanceType<typeof Cropper> | null>(null);
const croppedPreviewUrl = ref<string>("");
const urlImage = ref<string>("");
const urlLoading = ref(false);

let croppedCanvas: HTMLCanvasElement | null = null;
let currentObjectUrl: string | null = null;
let previewObjectUrl: string | null = null;

onMounted(() => {
  if (model.value instanceof File) {
    if (previewObjectUrl) URL.revokeObjectURL(previewObjectUrl);
    previewObjectUrl = URL.createObjectURL(model.value);
    croppedPreviewUrl.value = previewObjectUrl;
    currentObjectUrl = URL.createObjectURL(model.value);
    imgSrc.value = currentObjectUrl;
  }
});

onUnmounted(() => {
  if (currentObjectUrl) URL.revokeObjectURL(currentObjectUrl);
  if (previewObjectUrl) URL.revokeObjectURL(previewObjectUrl);
});

const handleLoadImage = () => {
  fileInputRef.value?.pickFiles();
};

const processFile = (file: File) => {
  if (currentObjectUrl) URL.revokeObjectURL(currentObjectUrl);
  currentObjectUrl = URL.createObjectURL(file);
  imgSrc.value = currentObjectUrl;
  croppedCanvas = null;
  dialogCropper.value = true;
};

const handleFileSelected = (file: File | null) => {
  if (file) processFile(file);
};

const handleDrop = (event: DragEvent) => {
  isDragging.value = false;
  const file = event.dataTransfer?.files[0];
  if (!file) return;

  if (!ACCEPTED_TYPES.includes(file.type)) {
    $q.notify({
      type: "negative",
      message: "Formato inválido. Use PNG, JPG, JPEG ou WEBP.",
    });
    return;
  }
  if (file.size > maxSize.value) {
    $q.notify({
      type: "negative",
      message: `Arquivo muito grande. Tamanho máximo: ${maxSize.value}MB.`,
    });
    return;
  }
  processFile(file);
};

const handlePasteImage = async () => {
  const clipboardText = await navigator.clipboard.readText();
  urlImage.value = clipboardText;
  handleLoadImageFromUrl();
};

const handleLoadImageFromUrl = async () => {
  if (!urlImage.value) return;
  urlLoading.value = true;
  try {
    const proxyUrl = `/api/proxy/image?url=${encodeURIComponent(urlImage.value)}`;
    const response = await fetch(proxyUrl);
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(
        (data as { statusMessage?: string }).statusMessage ??
          "Falha ao carregar imagem",
      );
    }
    const blob = await response.blob();
    const ext = blob.type.split("/")[1] ?? "png";
    const file = new File([blob], `image.${ext}`, { type: blob.type });
    processFile(file);
    urlImage.value = "";
  } catch (e) {
    $q.notify({
      type: "negative",
      message:
        e instanceof Error
          ? e.message
          : "Não foi possível carregar a imagem da URL informada.",
    });
  } finally {
    urlLoading.value = false;
  }
};

const handleRejected = () => {
  $q.notify({
    type: "negative",
    message: `Arquivo rejeitado. Verifique o formato e o tamanho (máx. ${humanStorageSize(maxSize.value)}).`,
  });
};

const handleCropChange = ({ canvas }: { canvas: HTMLCanvasElement }) => {
  croppedCanvas = canvas;
};

const clearImage = () => {
  model.value = null;
  fileModel.value = null;
  imgSrc.value = "";
  croppedPreviewUrl.value = "";
  croppedCanvas = null;
  currentObjectUrl = null;
  previewObjectUrl = null;
};

const clearUrlImage = () => {
  urlImage.value = "";
  croppedPreviewUrl.value = "";
};

const handleSaveImage = () => {
  if (!croppedCanvas) return;
  saving.value = true;
  croppedCanvas.toBlob(
    (blob) => {
      if (blob) {
        if (previewObjectUrl) URL.revokeObjectURL(previewObjectUrl);
        previewObjectUrl = URL.createObjectURL(blob);
        croppedPreviewUrl.value = previewObjectUrl;

        const file = new File([blob], "cropped-image.webp", {
          type: "image/webp",
        });
        model.value = file;
        $q.notify({ type: "positive", message: "Imagem salva com sucesso!" });
      }
      saving.value = false;
      dialogCropper.value = false;
    },
    "image/webp",
    0.9,
  );
};

const handleCancel = () => {
  dialogCropper.value = false;
  fileModel.value = null;
};

const handleReCrop = () => {
  if (imgSrc.value) dialogCropper.value = true;
};
</script>

<style scoped lang="sass">
@use "@/assets/styles/quasar-variables" as v

:deep(.q-card)
  border-radius: $generic-border-radius !important

:deep(.preview-img),
:deep(.preview-img .q-img__container),
:deep(.preview-img img)
  border-radius: $generic-border-radius !important
  overflow: hidden

:deep(.q-img__image)
  border-radius: $generic-border-radius !important

.drop-zone
  transition: background-color 0.2s, border-color 0.2s
  border: 2px dashed $grey-4 !important
  border-radius: $generic-border-radius !important

.drop-zone--active
  border-color: $primary !important
  background-color: $primary-light !important

.cropper
  height: 400px
  background: $dark

.preview-card
  overflow: hidden
  min-height: 200px

.preview-img
  max-height: 100px

.preview-overlay
  opacity: 0
  background: rgba(0, 0, 0, 0.4)
  transition: opacity 0.2s

.preview-img:hover .preview-overlay
  opacity: 1
</style>
