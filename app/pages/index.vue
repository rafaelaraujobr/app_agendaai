<template>
  <q-page padding>
    <client-only>
      <GridLayout
        v-model:layout="layout"
        :responsive-layouts="presetLayouts"
        :row-height="30"
        responsive
        @breakpoint-changed="breakpointChangedEvent"
      >
        <template #item="{ item }">
          <span class="text">{{ item.i }}</span>
        </template>
      </GridLayout>
    </client-only>
  </q-page>
</template>
<script setup lang="ts">
import { GridLayout, type Breakpoint, type Layout } from "grid-layout-plus";

definePageMeta({
  middleware: ["auth"],
});
const presetLayouts = reactive({
  md: [
    { x: 0, y: 0, w: 2, h: 5, i: "0" },
    { x: 2, y: 0, w: 2, h: 4, i: "1" },
    { x: 4, y: 0, w: 2, h: 5, i: "2" },
    { x: 6, y: 0, w: 2, h: 3, i: "3" },
    { x: 2, y: 4, w: 2, h: 3, i: "4" },
    { x: 4, y: 5, w: 2, h: 3, i: "5" },
    { x: 0, y: 2, w: 2, h: 5, i: "6" },
    { x: 2, y: 7, w: 2, h: 5, i: "7" },
    { x: 4, y: 8, w: 2, h: 5, i: "8" },
  ],
  lg: [
    { x: 0, y: 0, w: 2, h: 2, i: "0" },
    { x: 2, y: 0, w: 2, h: 4, i: "1" },
    { x: 4, y: 0, w: 2, h: 5, i: "2" },
    { x: 6, y: 0, w: 2, h: 3, i: "3" },
    { x: 8, y: 0, w: 2, h: 3, i: "4" },
    { x: 10, y: 0, w: 2, h: 3, i: "5" },
    { x: 0, y: 5, w: 2, h: 5, i: "6" },
    { x: 2, y: 5, w: 2, h: 5, i: "7" },
    { x: 4, y: 5, w: 2, h: 5, i: "8" },
  ],
});

const layout = ref(presetLayouts.lg);

function breakpointChangedEvent(newBreakpoint: Breakpoint, newLayout: Layout) {
  console.info(
    "BREAKPOINT CHANGED breakpoint=",
    newBreakpoint,
    ", layout: ",
    newLayout,
  );
}
</script>

<style scoped lang="sass">
@use '@/assets/styles/colors.sass' as *

.vgl-layout
  background-color: #fff

:deep(.vgl-item:not(.vgl-item--placeholder))
  background-color: $grey-1
  border: 1px solid $grey-3
  border-radius: $generic-border-radius


:deep(.vgl-item--resizing)
  opacity: 90%


:deep(.vgl-item--static)
  background-color: #cce
</style>
