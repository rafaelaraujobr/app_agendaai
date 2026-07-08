<template>
  <OnboardingStepCard
    title="Endereço do seu negócio"
    subtitle="Preencha o endereço do seu negócio"
    :animation-data="BusinessAnimation"
  >
    <q-form ref="formRef" @submit.prevent="handleSubmit">
      <div class="row q-col-gutter-x-md">
        <div class="col-12">
          <label class="text-weight-medium text-subtitle2 q-mb-xs"> CEP </label>
          <q-input
            v-model="address.zipCode"
            outlined
            bg-color="grey-1"
            mask="#####-###"
            placeholder="Ex: 12345-678"
            dense
            maxlength="9"
            :rules="[
              (val) => (val && val.length > 0) || 'CEP é obrigatório',
            ]"
            @blur="getAddressByZipCode(address.zipCode)"
          />
        </div>

        <div class="col-12">
          <label class="text-weight-medium text-subtitle2 q-mb-xs">
            Rua/Avenida
          </label>
          <q-input
            v-model="address.street"
            outlined
            bg-color="grey-1"
            type="text"
            placeholder="Ex: Rua das Flores"
            dense
            maxlength="50"
            :rules="[
              (val) => (val && val.length > 0) || 'Rua/Avenida é obrigatório',
            ]"
          />
        </div>

        <div class="col-12">
          <label class="text-weight-medium text-subtitle2 q-mb-xs">
            Número
          </label>
          <q-input
            ref="numberAddressRef"
            v-model="address.number"
            outlined
            bg-color="grey-1"
            type="text"
            placeholder="Ex: 1234"
            dense
            maxlength="10"
            :rules="[
              (val) =>
                notHaveNumber ||
                (val && val.length > 0) ||
                'Número é obrigatório',
            ]"
          >
            <template #append>
              <q-checkbox
                v-model="notHaveNumber"
                class="text-subtitle2"
                left-label
                size="sm"
                label="Sem número"
              />
            </template>
          </q-input>
        </div>

        <div class="col-12">
          <label class="text-weight-medium text-subtitle2 q-mb-xs">
            Complemento (opcional)
          </label>
          <q-input
            v-model="address.complement"
            outlined
            bg-color="grey-1"
            type="text"
            placeholder="Ex: Apt. 101"
            dense
          />
        </div>
      </div>
    </q-form>

    <template #actions>
      <q-btn
        label="Voltar"
        unelevated
        no-caps
        flat
        dense
        padding="sm lg"
        color="primary"
        @click="$emit('previous')"
      />
      <q-btn
        label="Avançar"
        unelevated
        no-caps
        dense
        padding="sm lg"
        color="primary"
        @click="handleSubmit"
      />
    </template>
  </OnboardingStepCard>
</template>

<script setup lang="ts">
import type { QForm } from "quasar";
import BusinessAnimation from "~/assets/lotties/maintenance_mode.json";
import type { OnboardingAddress } from "~/composables/useOnboarding";
import OnboardingStepCard from "./OnboardingStepCard.vue";

type FocusableInput = {
  focus: () => void;
};

type ViaCepResponse = {
  logradouro?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  erro?: boolean;
};

const emit = defineEmits<{
  next: [];
  previous: [];
}>();

const formRef = ref<QForm | null>(null);
const address = defineModel<OnboardingAddress>("address", { required: true });
const notHaveNumber = defineModel<boolean>("notHaveNumber", {
  required: true,
});
const numberAddressRef = ref<FocusableInput | null>(null);

const getAddressByZipCode = async (zipCode: string) => {
  const sanitizedZipCode = zipCode.replace(/\D/g, "");
  if (sanitizedZipCode.length !== 8) return;

  const response = await fetch(
    `https://viacep.com.br/ws/${sanitizedZipCode}/json/`,
  );
  const data = (await response.json()) as ViaCepResponse;
  if (data.erro) return;

  address.value.street = data.logradouro ?? "";
  address.value.neighborhood = data.bairro ?? "";
  address.value.city = data.localidade ?? "";
  address.value.state = data.uf ?? "";
  address.value.country = "Brasil";
  address.value.zipCode = sanitizedZipCode;
  numberAddressRef.value?.focus();
};

const handleSubmit = async () => {
  const isValid = await formRef.value?.validate();
  if (!isValid) return;

  emit("next");
};
</script>
