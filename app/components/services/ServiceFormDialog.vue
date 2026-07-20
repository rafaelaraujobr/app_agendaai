<template>
  <q-dialog v-model="dialogModel" persistent :maximized="$q.screen.lt.sm">
    <q-card class="service-form-card">
      <q-toolbar class="q-px-md">
        <q-toolbar-title>
          {{ service ? "Editar serviço" : "Adicionar serviço" }}
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
            :label="service ? 'Salvar' : 'Criar'"
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
  createEmptyServiceForm,
  normalizeServiceSlug,
} from "~/composables/useServices";
import ServiceImageField from "./ServiceImageField.vue";

const props = defineProps<{
  service: ManagedService | null;
  illustrations: ServiceIllustration[];
  saving: boolean;
}>();

const emit = defineEmits<{
  save: [form: ServiceForm, serviceId: string | null];
}>();

const dialogModel = defineModel<boolean>({ required: true });
const formRef = ref<{ validate: () => Promise<boolean> } | null>(null);
const form = reactive<ServiceForm>(createEmptyServiceForm());
const hasCustomSlug = ref(false);
const imageFieldKey = ref(0);

const hydrateForm = () => {
  const service = props.service;
  Object.assign(
    form,
    service
      ? {
          name: service.name,
          slug: service.slug,
          description: service.description || "",
          imageUrl: service.imageUrl,
          imageFile: null,
          illustrationId: service.illustrationId,
          durationMinutes: service.durationMinutes,
          price: service.price,
          isActive: service.isActive,
          position: service.position,
        }
      : createEmptyServiceForm(),
  );
  hasCustomSlug.value = Boolean(service);
  imageFieldKey.value += 1;
};

watch(dialogModel, (isOpen) => {
  if (isOpen) hydrateForm();
});

const updateName = (value: string | number | null) => {
  form.name = String(value ?? "");
  if (!hasCustomSlug.value) {
    form.slug = normalizeServiceSlug(form.name);
  }
};

const updateSlug = (value: string | number | null) => {
  hasCustomSlug.value = true;
  form.slug = normalizeServiceSlug(String(value ?? ""));
};

const submit = async () => {
  const isValid = await formRef.value?.validate();
  if (!isValid) return;
  emit("save", { ...form }, props.service?.id ?? null);
};
</script>

<style scoped lang="sass">
.service-form-card
  max-height: 92vh;


@media (max-width: 599px)
  .service-form-card
    max-height: none;
</style>
