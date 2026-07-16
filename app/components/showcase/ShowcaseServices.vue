<template>
  <section id="servicos" class="q-pt-xl q-pb-md">
    <div class="row items-end justify-between q-col-gutter-md q-mb-lg">
      <div class="col-12 col-md">
        <div class="text-overline" :style="{ color: primaryColor }">
          Serviços
        </div>
        <h2 class="text-h4 text-weight-bold q-my-none">
          Escolha o melhor para você
        </h2>
      </div>
      <div class="col-12 col-md-auto text-body1 text-grey-7">
        Conheça os serviços disponíveis e agende seu horário.
      </div>
    </div>

    <div class="row q-col-gutter-lg">
      <div
        v-for="service in services"
        :key="service.id"
        class="col-12 col-sm-6 col-lg-4"
      >
        <q-card flat bordered class="column full-height rounded-borders">
          <q-img
            v-if="getShowcaseServiceImage(service)"
            :src="getShowcaseServiceImage(service)!"
            :alt="service.name"
            ratio="1.6"
            fit="cover"
          />
          <div
            v-else
            class="column items-center justify-center bg-grey-2"
            :style="{ color: primaryColor, minHeight: '210px' }"
          >
            <q-icon name="mdi-content-cut" size="56px" />
          </div>

          <q-card-section class="col">
            <div class="text-h6 text-weight-bold">{{ service.name }}</div>
            <div class="row items-center q-gutter-x-sm text-grey-7 q-mt-xs">
              <q-icon name="mdi-clock-outline" />
              <span>{{ formatShowcaseDuration(service.durationMinutes) }}</span>
            </div>
            <p
              v-if="service.description"
              class="text-body2 text-grey-7 q-mb-none q-mt-sm service-description"
            >
              {{ service.description }}
            </p>
          </q-card-section>

          <q-separator />
          <q-card-actions class="items-center q-pa-md">
            <div class="text-h6 text-weight-bold">
              {{ formatShowcaseCurrency(service.price) }}
            </div>
            <q-space />
            <q-btn
              v-if="getServiceWhatsappUrl(service.name)"
              label="Agendar"
              icon-right="mdi-arrow-right"
              text-color="white"
              no-caps
              unelevated
              :style="{ backgroundColor: secondaryColor }"
              :href="getServiceWhatsappUrl(service.name) || undefined"
              target="_blank"
              rel="noopener noreferrer"
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { PublicBusiness } from "~/types/public-business";
import {
  formatShowcaseCurrency,
  formatShowcaseDuration,
  getShowcaseServiceImage,
} from "~/composables/usePublicBusiness";

defineProps<{
  services: PublicBusiness["services"];
  primaryColor: string;
  secondaryColor: string;
  getServiceWhatsappUrl: (serviceName: string) => string | null;
}>();
</script>

<style scoped>
.service-description {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  line-clamp: 3;
}
</style>
