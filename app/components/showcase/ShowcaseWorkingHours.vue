<template>
  <q-card flat bordered class="full-height rounded-borders">
    <q-card-section class="q-pa-lg">
      <div class="row items-center no-wrap q-gutter-md">
        <q-avatar
          icon="mdi-clock-outline"
          text-color="white"
          :style="{ backgroundColor: primaryColor }"
        />
        <div>
          <div class="text-h6 text-weight-bold">Horário de atendimento</div>
          <div class="text-body2 text-grey-7">Confira nossos horários</div>
        </div>
      </div>
    </q-card-section>

    <q-separator />

    <q-list separator>
      <q-item
        v-for="workingHour in workingHours"
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
</template>

<script setup lang="ts">
import type { PublicBusiness } from "~/types/public-business";
import {
  formatShowcaseBreak,
  formatShowcaseWorkingHour,
  showcaseDayLabels,
} from "~/composables/usePublicBusiness";

defineProps<{
  workingHours: PublicBusiness["businessWorkingHours"];
  primaryColor: string;
}>();
</script>
