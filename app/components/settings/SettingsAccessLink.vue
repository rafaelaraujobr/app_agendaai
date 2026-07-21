<template>
  <SettingsSectionCard
    title="Link de acesso"
    subtitle="Defina o endereço usado pelos clientes para acessar sua página."
    icon="mdi-link-variant"
    :loading="loading"
    @save="$emit('save')"
  >
    <q-label class="text-weight-medium text-subtitle2 q-mb-xs">
      Endereço público(slug)
    </q-label>
    <q-input
      :model-value="model.slug"
      outlined
      bg-color="grey-1"
      dense
      maxlength="100"
      suffix=".roostec.com.br"
      :rules="slugRules"
      @update:model-value="updateSlug"
    >
      <template #prepend>
        <span class="text-body2">https://</span>
      </template>
      <template #after>
        <q-btn
          icon="mdi-content-copy"
          dense
          padding="sm md"
          @click="copyUrl"
          :label="$q.screen.lt.sm ? '' : 'Copiar URL'"
          color="primary"
          no-caps
          v-if="!$q.screen.lt.sm"
        >
          <q-tooltip>Copiar URL</q-tooltip>
        </q-btn>
      </template>
    </q-input>
    <q-card flat class="share-card q-mt-md">
      <q-card-section class="q-pa-lg">
        <div class="row items-center q-col-gutter-xl">
          <div class="col-12 col-md-7">
            <div class="row items-start no-wrap q-gutter-md q-mb-md">
              <div>
                <div class="text-h6">Compartilhe seu link</div>
                <div class="text-body2 text-grey-7">
                  Facilite o acesso dos seus clientes baixando o QR Code ou
                  enviando o endereço diretamente pelo WhatsApp.
                </div>
              </div>
            </div>

            <div class="share-actions row q-col-gutter-sm">
              <div class="col-12 col-sm-auto">
                <q-btn
                  class="share-action-btn"
                  color="primary"
                  icon="mdi-download"
                  label="Baixar QR Code"
                  no-caps
                  unelevated
                  :disable="!model.slug"
                  @click="downloadQrCode"
                />
              </div>
              <div class="col-12 col-sm-auto">
                <q-btn
                  class="share-action-btn whatsapp-button"
                  icon="mdi-whatsapp"
                  label="Compartilhar no WhatsApp"
                  no-caps
                  unelevated
                  :disable="!model.slug"
                  @click="shareViaWhatsApp"
                />
              </div>
            </div>
          </div>

          <div class="col-12 col-md-5">
            <div class="qrcode-preview column items-center">
              <div ref="qrcodeContainer" class="qrcode-image">
                <Qrcode :value="url" :height="200" />
              </div>
              <div class="text-caption text-grey-7 text-center q-mt-sm">
                Aponte a câmera do celular para acessar
              </div>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
    <q-banner rounded class="bg-grey-1 text-grey-8 q-mt-lg">
      <template #avatar>
        <q-icon name="mdi-information-outline" />
      </template>
      Alterar este endereço fará com que o link anterior deixe de funcionar.
    </q-banner>
  </SettingsSectionCard>
</template>

<script setup lang="ts">
import type { SettingsForm } from "~/composables/useSettings";
import SettingsSectionCard from "./SettingsSectionCard.vue";

defineProps<{ loading?: boolean }>();
defineEmits<{ save: [] }>();
const model = defineModel<SettingsForm>({ required: true });
const qrcodeContainer = ref<HTMLElement | null>(null);

const url = computed(() => `https://${model.value.slug}.roostec.com.br`);

const copyUrl = () => {
  navigator.clipboard.writeText(url.value);
  Notify.create({
    message: "URL copiada para a área de transferência",
    color: "primary",
    icon: "mdi-content-copy",
    timeout: 2000,
  });
};

const shareViaWhatsApp = () => {
  const message = `Agende seu horário conosco!\n\nAcesse: ${url.value}`;
  const whatsappUrl = `https://api.whatsapp.com/send/?text=${encodeURIComponent(message)}&type=custom_url&app_absent=0`;
  window.open(whatsappUrl, "_blank");
};

const downloadBlob = (blob: Blob) => {
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = `qrcode-${model.value.slug || "negocio"}.png`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 100);
};

const downloadQrCode = async () => {
  const renderedCanvas = qrcodeContainer.value?.querySelector("canvas");
  if (renderedCanvas) {
    renderedCanvas.toBlob((blob) => {
      if (blob) downloadBlob(blob);
    }, "image/png");
    return;
  }

  const renderedSvg = qrcodeContainer.value?.querySelector("svg");
  if (!renderedSvg) {
    Notify.create({
      type: "negative",
      message: "Não foi possível gerar a imagem do QR Code",
    });
    return;
  }

  const svg = renderedSvg.cloneNode(true) as SVGElement;
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  const svgBlob = new Blob([new XMLSerializer().serializeToString(svg)], {
    type: "image/svg+xml;charset=utf-8",
  });
  const svgUrl = URL.createObjectURL(svgBlob);

  try {
    const image = new Image();
    image.src = svgUrl;
    await image.decode();

    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 1024;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas indisponível");

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    const pngBlob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/png"),
    );
    if (!pngBlob) throw new Error("Falha ao criar PNG");

    downloadBlob(pngBlob);
    Notify.create({
      type: "positive",
      message: "QR Code baixado com sucesso",
    });
  } catch {
    Notify.create({
      type: "negative",
      message: "Não foi possível baixar o QR Code",
    });
  } finally {
    URL.revokeObjectURL(svgUrl);
  }
};
const slugRules = [
  (value: string) => value.length >= 2 || "Use pelo menos 2 caracteres",
  (value: string) =>
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) ||
    "Use apenas letras minúsculas, números e hífens",
];

const updateSlug = (value: string | number | null) => {
  model.value.slug = String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);
};
</script>

<style scoped>
.share-card {
  background: #fafafa;
  border-color: #e0e0e0;
}

.qrcode-preview {
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  background: #fff;
  padding: 20px;
}

.qrcode-image {
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 100%;
}

.qrcode-image :deep(svg),
.qrcode-image :deep(canvas) {
  display: block;
  max-width: 100%;
  height: auto;
}

.whatsapp-button {
  background: #25d366;
  color: #fff;
}

@media (max-width: 599px) {
  .share-card :deep(.q-card__section) {
    padding: 16px;
  }

  .share-action-btn {
    width: 100%;
  }

  .qrcode-preview {
    padding: 16px;
  }
}
</style>
