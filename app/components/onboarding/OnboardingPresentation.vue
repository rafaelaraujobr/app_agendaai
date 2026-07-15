<template>
  <OnboardingStepCard
    title="Vamos configurar seu negócio"
    subtitle="Em poucos passos, deixaremos seu espaço pronto para receber agendamentos."
    :animation-data="WelcomeAnimation"
    :animation-height="300"
    :animation-width="300"
  >
    <div class="column q-gutter-y-md justify-center items-center">
      <div class="row items-center text-caption text-grey-7">
        <q-icon name="mdi-clock-outline" size="sm" class="q-mr-sm" />
        Leva apenas alguns minutos.
      </div>
    </div>

    <template #actions>
      <q-btn
        label="Começar"
        unelevated
        no-caps
        dense
        padding="sm lg"
        color="primary"
        @click="$emit('next')"
      />
    </template>
  </OnboardingStepCard>
</template>

<script setup lang="ts">
import WelcomeAnimation from "~/assets/lotties/develope.json";
import OnboardingStepCard from "./OnboardingStepCard.vue";

defineEmits<{
  next: [];
}>();

const presentationItems = [
  {
    icon: "mdi-store-outline",
    title: "Dados do negócio",
    description: "Nome, área de atuação, contato e endereço personalizado.",
  },
  {
    icon: "mdi-image-outline",
    title: "Identidade e canais",
    description: "Logo e canais usados pelos seus clientes.",
  },
  {
    icon: "mdi-calendar-clock-outline",
    title: "Disponibilidade",
    description: "Dias e horários em que seu negócio atende.",
  },
];
</script>
