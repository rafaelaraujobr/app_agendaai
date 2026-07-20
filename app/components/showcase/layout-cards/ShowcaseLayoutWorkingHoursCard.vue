<template>
  <q-card
    v-if="context.business.businessWorkingHours.length"
    flat
    bordered
    class="full-height rounded-borders"
  >
    <q-card-section class="q-pa-lg">
      <div class="text-h6 text-weight-bold">Horário de atendimento</div>
      <div class="text-body2 text-grey-7">Confira nossos horários</div>
    </q-card-section>

    <q-separator />

    <q-list separator>
      <q-item
        v-for="workingHour in context.sortedWorkingHours"
        :key="workingHour.dayOfWeek"
        class="q-px-lg"
      >
        <q-item-section>
          <q-item-label>
            {{ showcaseDayLabels[workingHour.dayOfWeek] }}
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-item-label
            :class="workingHour.isActive ? 'text-grey-9' : 'text-negative'"
          >
            {{ formatShowcaseWorkingHour(workingHour) }}
          </q-item-label>
          <q-item-label v-if="formatShowcaseBreak(workingHour)" caption>
            Intervalo: {{ formatShowcaseBreak(workingHour) }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-card>

  <ShowcaseLayoutEmptyCard
    v-else
    message="Horários de funcionamento ainda não configurados"
  />
</template>

<script setup lang="ts">
import type { ShowcaseLayoutContext } from "~/types/showcase-layout-context";
import {
  formatShowcaseBreak,
  formatShowcaseWorkingHour,
  showcaseDayLabels,
} from "~/composables/usePublicBusiness";
import ShowcaseLayoutEmptyCard from "./ShowcaseLayoutEmptyCard.vue";

defineProps<{ context: ShowcaseLayoutContext }>();
</script>
