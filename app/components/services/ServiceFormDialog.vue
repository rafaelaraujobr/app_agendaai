<template>
  <q-dialog v-model="dialogModel" persistent :maximized="$q.screen.lt.sm">
    <q-card class="service-form-card">
      <q-toolbar class="q-px-md">
        <q-toolbar-title>
          {{ service ? "Editar serviço" : "Novo serviço" }}
        </q-toolbar-title>
        <q-btn
          icon="mdi-close"
          aria-label="Fechar"
          flat
          round
          :disable="saving"
          @click="dialogModel = false"
        />
      </q-toolbar>

      <q-separator />

      <q-form ref="formRef" class="col scroll" @submit.prevent="submit">
        <q-card-section class="q-pa-lg">
          <div class="text-subtitle1 text-weight-medium q-mb-md">
            Informações do serviço
          </div>

          <div class="row q-col-gutter-md">
            <div class="col-12">
              <label class="text-weight-medium text-subtitle2 q-mb-xs">
                Nome
              </label>
              <q-input
                v-model="form.name"
                outlined
                dense
                bg-color="grey-1"
                maxlength="150"
                :rules="[
                  (value) =>
                    String(value || '').trim().length >= 2 ||
                    'Informe o nome do serviço',
                ]"
                @update:model-value="updateName"
              />
            </div>

            <div class="col-12 col-sm-6">
              <label class="text-weight-medium text-subtitle2 q-mb-xs">
                Preço
              </label>
              <q-input
                v-model.number="form.price"
                type="number"
                inputmode="decimal"
                prefix="R$"
                min="0"
                step="0.01"
                outlined
                dense
                bg-color="grey-1"
                :rules="[
                  (value) =>
                    (value !== null && Number(value) >= 0) ||
                    'Informe um preço válido',
                ]"
              />
            </div>

            <div class="col-12 col-sm-6">
              <label class="text-weight-medium text-subtitle2 q-mb-xs">
                Duração
              </label>
              <q-input
                v-model.number="form.durationMinutes"
                type="number"
                inputmode="numeric"
                suffix="minutos"
                min="5"
                max="1440"
                step="5"
                outlined
                dense
                bg-color="grey-1"
                :rules="[
                  (value) =>
                    Number(value) >= 5 || 'A duração mínima é de 5 minutos',
                ]"
              />
            </div>

            <div class="col-12">
              <label class="text-weight-medium text-subtitle2 q-mb-xs">
                Descrição
              </label>
              <q-input
                v-model="form.description"
                type="textarea"
                rows="3"
                maxlength="200"
                counter
                outlined
                bg-color="grey-1"
              />
            </div>
          </div>

          <q-separator class="q-my-lg" />

          <ServiceImageField
            :key="imageFieldKey"
            v-model="form"
            :illustrations="illustrations"
          />

          <q-separator class="q-my-lg" />

          <q-toggle
            v-model="form.isActive"
            label="Serviço ativo e visível para os clientes"
            color="positive"
          />

          <q-separator class="q-my-lg" />

          <ServiceHighlightFields
            v-model="form.highlight"
            :service-image-url="servicePreviewImage"
            :max-highlights="maxHighlights"
            :disable-toggle="highlightToggleDisabled"
          />
        </q-card-section>

        <q-separator />

        <q-card-actions align="right" class="q-pa-md">
          <q-btn
            label="Cancelar"
            color="primary"
            flat
            dense
            padding="sm md"
            no-caps
            :disable="saving"
            @click="dialogModel = false"
          />
          <q-btn
            :label="service ? 'Salvar' : 'Criar serviço'"
            color="primary"
            no-caps
            dense
            padding="sm md"
            unelevated
            :loading="saving"
            @click="submit"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import type {
  ManagedService,
  ServiceForm,
  ServiceIllustration,
} from "~/types/service";
import {
  normalizeServiceSlug,
} from "~/composables/useServices";
import ServiceImageField from "./ServiceImageField.vue";
import ServiceHighlightFields from "./ServiceHighlightFields.vue";

const props = defineProps<{
  service: ManagedService | null;
  illustrations: ServiceIllustration[];
  saving: boolean;
  initialForm: ServiceForm;
  maxHighlights: number;
  hasReachedHighlightLimit: boolean;
}>();

const emit = defineEmits<{
  save: [form: ServiceForm, serviceId: string | null];
}>();

const dialogModel = defineModel<boolean>({ required: true });
const formRef = ref<{ validate: () => Promise<boolean> } | null>(null);
const form = reactive<ServiceForm>(props.initialForm);
const hasCustomSlug = ref(false);
const imageFieldKey = ref(0);

const highlightToggleDisabled = computed(
  () =>
    props.hasReachedHighlightLimit &&
    !props.service?.highlight &&
    !form.highlight.enabled,
);

const servicePreviewImage = computed(() => {
  if (form.imageUrl) return form.imageUrl;
  const illustration = props.illustrations.find(
    (item) => item.id === form.illustrationId,
  );
  return illustration?.imageUrl ?? null;
});

const hydrateForm = () => {
  Object.assign(form, structuredClone(toRaw(props.initialForm)));
  hasCustomSlug.value = Boolean(props.service);
  imageFieldKey.value += 1;
};

watch(dialogModel, (isOpen) => {
  if (isOpen) hydrateForm();
});

watch(
  () => props.initialForm,
  () => {
    if (dialogModel.value) hydrateForm();
  },
);

const updateName = (value: string | number | null) => {
  form.name = String(value ?? "");
  if (!hasCustomSlug.value) {
    form.slug = normalizeServiceSlug(form.name);
  }
};

const submit = async () => {
  const isValid = await formRef.value?.validate();
  if (!isValid) return;
  emit("save", structuredClone(toRaw(form)), props.service?.id ?? null);
};
</script>

<style scoped lang="sass">
.service-form-card
  max-height: 92vh
  width: 760px
  max-width: 95vw

@media (max-width: 599px)
  .service-form-card
    max-height: none
    width: 100%
</style>
