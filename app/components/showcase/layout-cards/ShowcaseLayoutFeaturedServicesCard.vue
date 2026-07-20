<template>
  <q-card flat bordered class="full-height column rounded-borders">
    <q-card-section class="q-pb-sm">
      <div class="text-overline" :style="{ color: context.primaryColor }">
        Destaques
      </div>
      <div class="text-h6 text-weight-bold">Serviços em destaque</div>
      <div class="text-body2 text-grey-7">
        Escolha uma opção e agende seu horário.
      </div>
    </q-card-section>

    <q-separator />

    <q-list v-if="featuredServices.length" separator class="col scroll">
      <q-item
        v-for="service in featuredServices"
        :key="service.id"
        class="q-py-md"
      >
        <q-item-section avatar>
          <q-avatar rounded color="grey-2" size="52px">
            <q-img
              v-if="getShowcaseServiceImage(service)"
              :src="getShowcaseServiceImage(service)!"
              :alt="service.name"
            />
            <q-icon v-else name="mdi-briefcase-outline" color="grey-7" />
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label class="text-weight-bold">{{ service.name }}</q-item-label>
          <q-item-label caption>
            {{ formatShowcaseDuration(service.durationMinutes) }}
          </q-item-label>
        </q-item-section>

        <q-item-section side>
          <div class="text-weight-bold text-grey-9">
            {{ formatShowcaseCurrency(service.price) }}
          </div>
          <q-btn
            v-if="context.getServiceWhatsappUrl(service.name)"
            label="Agendar"
            dense
            flat
            no-caps
            :style="{ color: context.secondaryColor }"
            :href="context.getServiceWhatsappUrl(service.name) || undefined"
            target="_blank"
            rel="noopener noreferrer"
          />
        </q-item-section>
      </q-item>
    </q-list>

    <q-card-section v-else class="col flex flex-center text-grey-7">
      Nenhum serviço disponível no momento.
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import type { ShowcaseLayoutContext } from "~/types/showcase-layout-context";
import {
  formatShowcaseCurrency,
  formatShowcaseDuration,
  getShowcaseServiceImage,
} from "~/composables/usePublicBusiness";

const props = defineProps<{ context: ShowcaseLayoutContext }>();

const featuredServices = computed(() =>
  props.context.business.services.slice(0, 5),
);
</script>
