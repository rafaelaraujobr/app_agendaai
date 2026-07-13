<template>
  <OnboardingStepCard
    title="Revisão final"
    subtitle="Confira as informações antes de criar o negócio."
    :animation-data="ReviewAnimation"
  >
    <div class="column q-gutter-md">
      <q-list bordered separator class="rounded-borders bg-white">
        <q-item>
          <q-item-section>
            <q-item-label class="text-weight-bold">Negócio</q-item-label>
            <q-item-label caption>
              {{ payload.business.name || "Nome não informado" }}
            </q-item-label>
            <q-item-label caption>
              /{{ payload.business.slug || "slug-nao-informado" }}
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section>
            <q-item-label class="text-weight-bold">Identidade visual</q-item-label>
            <q-item-label caption>
              Primária: {{ payload.businessLayout.primaryColor }} |
              Secundária: {{ payload.businessLayout.secondaryColor }}
            </q-item-label>
            <q-item-label caption>
              Fonte: {{ payload.businessLayout.settings.fontFamily }}
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section>
            <q-item-label class="text-weight-bold">Canais</q-item-label>
            <q-item-label caption>
              {{ payload.businessChannels.length }} canal(is) configurado(s)
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section>
            <q-item-label class="text-weight-bold">Endereço</q-item-label>
            <q-item-label caption>
              {{ formattedAddress }}
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section>
            <q-item-label class="text-weight-bold">
              Horário de funcionamento
            </q-item-label>
            <q-item-label caption>
              {{ activeWorkingHoursCount }} dia(s) aberto(s)
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>

      <q-expansion-item
        dense
        expand-separator
        label="Ver payload do endpoint"
        class="bg-grey-1 rounded-borders border-xs-grey-3"
      >
        <q-card flat class="bg-grey-1">
          <q-card-section class="q-pa-sm">
            <pre class="text-caption q-ma-none">{{ payloadPreview }}</pre>
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </div>

    <template #actions>
      <q-btn
        label="Voltar"
        unelevated
        no-caps
        dense
        padding="sm lg"
        color="primary"
        :disable="loading"
        @click="$emit('previous')"
      />
      <q-btn
        label="Criar negócio"
        unelevated
        no-caps
        dense
        padding="sm lg"
        color="primary"
        :loading="loading"
        @click="$emit('submit')"
      />
    </template>
  </OnboardingStepCard>
</template>

<script setup lang="ts">
import ReviewAnimation from "~/assets/lotties/social_media.json";
import type { CreateBusinessPayload } from "~/composables/useOnboarding";
import OnboardingStepCard from "./OnboardingStepCard.vue";

const props = defineProps<{
  payload: CreateBusinessPayload;
  loading?: boolean;
}>();

defineEmits<{
  previous: [];
  submit: [];
}>();

const activeWorkingHoursCount = computed(() => {
  return props.payload.businessWorkingHours.filter(
    (workingHour) => workingHour.isActive,
  ).length;
});

const formattedAddress = computed(() => {
  const businessAddress = props.payload.businessAddress;
  return [
    businessAddress.address,
    businessAddress.number,
    businessAddress.neighborhood,
    businessAddress.city,
    businessAddress.state,
  ]
    .filter(Boolean)
    .join(", ");
});

const payloadPreview = computed(() => JSON.stringify(props.payload, null, 2));
</script>
