<template>
  <q-page padding class="wrapper">
    <QCalendarDay
      v-model="selectedDate"
      :now="today"
      locale="pt-BR"
      :weekdays="[0, 1, 2, 3, 4, 5, 6]"
      short-weekday-label
      :min-weekday-length="3"
      view="day"
      :interval-start="7"
      :interval-count="14"
      :interval-minutes="60"
    />
  </q-page>
</template>

<script setup lang="ts">
import { QCalendarDay } from "@quasar/quasar-ui-qcalendar";
import "@quasar/quasar-ui-qcalendar/index.css";

const TIME_ZONE = "America/Sao_Paulo";

function getDateInTimeZone(
  date: Date = new Date(),
  timeZone = TIME_ZONE,
): string {
  const parts = new Intl.DateTimeFormat("pt-BR", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const values = Object.fromEntries(
    parts.map(({ type, value }) => [type, value]),
  );

  return `${values.year}-${values.month}-${values.day}`;
}

const today = ref(getDateInTimeZone());
const selectedDate = ref(today.value);
</script>
