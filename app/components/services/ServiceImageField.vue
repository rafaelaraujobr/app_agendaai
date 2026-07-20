<template>
  <div>
    <div class="text-subtitle2 text-weight-medium q-mb-sm">
      Imagem do serviço
    </div>

    <q-btn-toggle
      v-model="imageMode"
      spread
      no-caps
      unelevated
      toggle-color="primary"
      color="grey-2"
      text-color="grey-8"
      :options="[
        {
          label: 'Enviar imagem',
          value: 'upload',
          icon: 'mdi-cloud-upload-outline',
        },
        {
          label: 'Galeria',
          value: 'automatic',
          icon: 'mdi-image-outline',
        },
      ]"
      class="q-mb-md"
    />

    <template v-if="imageMode === 'gallery'">
      <q-banner
        v-if="!illustrations.length"
        rounded
        class="bg-grey-1 text-grey-8"
      >
        <template #avatar>
          <q-icon name="mdi-image-auto-adjust" />
        </template>
        Nenhuma ilustração específica está disponível. O sistema utilizará o
        ícone padrão do serviço.
      </q-banner>

      <div v-else class="row q-col-gutter-sm scroll" style="max-height: 150px">
        <div
          v-for="illustration in illustrations"
          :key="illustration.id"
          class="col-6 col-sm-4"
        >
          <q-card
            flat
            bordered
            class="illustration-card cursor-pointer full-height"
            :class="{
              'illustration-card--selected':
                model.illustrationId === illustration.id,
            }"
            @click="selectIllustration(illustration.id)"
          >
            <q-img
              :src="illustration.imageUrl"
              :alt="illustration.title"
              ratio="1"
              fit="cover"
            />
            <q-card-section class="q-pa-sm">
              <div class="text-caption ellipsis">{{ illustration.title }}</div>
            </q-card-section>
            <q-icon
              v-if="model.illustrationId === illustration.id"
              name="mdi-check-circle"
              color="primary"
              size="24px"
              class="selection-icon"
            />
          </q-card>
        </div>
      </div>

      <q-btn
        v-if="model.illustrationId"
        label="Usar seleção automática"
        icon="mdi-auto-fix"
        flat
        dense
        no-caps
        color="primary"
        class="q-mt-sm"
        @click="model.illustrationId = null"
      />
    </template>

    <template v-else>
      <q-card
        v-if="model.imageUrl && !model.imageFile"
        flat
        bordered
        class="row items-center no-wrap q-pa-sm q-mb-md"
      >
        <q-avatar rounded size="64px">
          <q-img :src="model.imageUrl" alt="Imagem atual do serviço" />
        </q-avatar>
        <div class="col q-ml-md">
          <div class="text-subtitle2">Imagem atual</div>
          <div class="text-caption text-grey-7">
            Envie outra imagem para substituí-la.
          </div>
        </div>
        <q-btn
          icon="mdi-delete-outline"
          aria-label="Remover imagem atual"
          flat
          round
          color="negative"
          @click="model.imageUrl = null"
        />
      </q-card>

      <InputImageCrop
        v-model="model.imageFile"
        :aspect-ratio="1"
        label="imagem do serviço"
        :max-file-size="5"
        :is-url-input="false"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import InputImageCrop from "~/components/common/InputImageCrop.vue";
import type { ServiceForm, ServiceIllustration } from "~/types/service";

const props = defineProps<{
  illustrations: ServiceIllustration[];
}>();

const model = defineModel<ServiceForm>({ required: true });

const imageMode = ref<"gallery" | "upload">(
  model.value.imageUrl || model.value.imageFile ? "upload" : "gallery",
);

watch(imageMode, (mode) => {
  if (mode === "upload") {
    model.value.illustrationId = null;
    return;
  }

  model.value.imageUrl = null;
  model.value.imageFile = null;
});

watch(
  () => [model.value.imageUrl, model.value.imageFile] as const,
  ([imageUrl, imageFile]) => {
    if (imageUrl || imageFile) imageMode.value = "upload";
  },
);

watch(
  () => props.illustrations,
  (illustrations) => {
    if (
      imageMode.value === "gallery" &&
      model.value.illustrationId &&
      !illustrations.some((item) => item.id === model.value.illustrationId)
    ) {
      model.value.illustrationId = null;
    }
  },
);

const selectIllustration = (id: string) => {
  model.value.illustrationId = model.value.illustrationId === id ? null : id;
  model.value.imageUrl = null;
  model.value.imageFile = null;
};
</script>

<style scoped>
.illustration-card {
  position: relative;
  overflow: hidden;
}

.illustration-card--selected {
  border: 2px solid var(--q-primary);
}

.selection-icon {
  position: absolute;
  top: 8px;
  right: 8px;
  border-radius: 50%;
  background: white;
}
</style>
