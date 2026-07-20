<template>
  <q-card
    flat
    bordered
    class="full-height rounded-borders overflow-hidden"
    :style="cardStyle"
  >
    <q-card-section
      class="full-height row items-center q-col-gutter-lg text-center q-pa-lg"
    >
      <div class="col-12 col-sm">
        <q-icon
          name="mdi-calendar-clock-outline"
          size="48px"
          :style="{ color: context.primaryColor }"
        />
        <div class="text-h5 text-weight-bold q-mt-md">Pronto para agendar?</div>
        <div class="text-body2 text-grey-7 q-mt-xs">
          Escolha o melhor horário e fale com nossa equipe pelo WhatsApp.
        </div>
      </div>

      <div class="col-12 col-sm-auto">
        <q-btn
          label="Agendar agora"
          icon="mdi-whatsapp"
          no-caps
          unelevated
          padding="sm lg"
          text-color="white"
          class="cta-button"
          :disable="!context.whatsappUrl"
          :href="context.whatsappUrl || undefined"
          target="_blank"
          rel="noopener noreferrer"
          :style="{ backgroundColor: context.secondaryColor }"
        />
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import type { ShowcaseLayoutContext } from "~/types/showcase-layout-context";

const props = defineProps<{ context: ShowcaseLayoutContext }>();

const cardStyle = computed(() => ({
  background: `linear-gradient(135deg, ${props.context.primaryColor}12, ${props.context.secondaryColor}18)`,
}));
</script>

<style scoped lang="sass">
.cta-button
  min-width: 180px
  border-radius: 999px
</style>
