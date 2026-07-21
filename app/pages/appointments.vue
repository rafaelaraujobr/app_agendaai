<template>
  <q-page padding class="wrapper">
    <QCalendarDay
      v-model="selectedDate"
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
const selectedDate = ref<Date>(new Date());
</script>
