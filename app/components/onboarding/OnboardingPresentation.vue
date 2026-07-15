<template>
  <q-card
    flat
    class="column items-center justify-center q-pa-lg"
    style="width: 900px; max-width: 100%; min-height: 520px"
  >
    <q-card-section class="full-width column items-center q-pa-none">
      <ClientOnly>
        <div
          class="full-width row items-center justify-center"
          style="max-width: 320px"
        >
          <Vue3Lottie
            :animation-data="WelcomeAnimation"
            :height="260"
            width="100%"
          />
        </div>
      </ClientOnly>

      <div class="text-center">
        <div class="text-h5 text-weight-medium">
          Vamos configurar seu negócio
        </div>
        <div class="text-subtitle2 text-grey-7 q-mt-xs">
          Em poucos passos, deixaremos seu espaço pronto para receber
          agendamentos.
        </div>
      </div>
    </q-card-section>

    <q-card-section class="column items-center q-gutter-y-md q-pb-none">
      <q-chip
        icon="mdi-clock-outline"
        color="grey-2"
        text-color="grey-8"
      >
        Leva apenas alguns minutos
      </q-chip>

      <q-btn
        label="Vamos começar"
        icon-right="mdi-arrow-right"
        unelevated
        no-caps
        dense
        padding="sm lg"
        color="primary"
        @click="$emit('next')"
      />
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import WelcomeAnimation from "~/assets/lotties/develope.json";

defineEmits<{
  next: [];
}>();
</script>
