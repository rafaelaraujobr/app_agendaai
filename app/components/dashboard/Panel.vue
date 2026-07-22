<template>
  <q-toolbar class="gt-xs">
    <q-toolbar-title>
      <!-- <q-icon name="mdi-view-dashboard" /> -->
      Dashboard
    </q-toolbar-title>
    <q-toggle
      :model-value="isEditMode"
      :label="isEditMode ? 'Modo edição ativo' : 'Editar painel'"
      color="primary"
      @update:model-value="toggleEditMode"
    />
  </q-toolbar>
  <client-only>
    <GridLayout
      v-model:layout="layout"
      :responsive-layouts="presetLayouts"
      :col-num="colNum"
      :cols="gridColumns"
      :row-height="rowHeight"
      :is-draggable="isEditMode"
      :is-resizable="isEditMode"
      :class="{ 'vgl-layout--editing': isEditMode }"
      :style="gridStyle"
      responsive
      @breakpoint-changed="breakpointChangedEvent"
    >
      <GridItem
        v-for="item in layout"
        :key="item.i"
        :x="item.x"
        :y="item.y"
        :w="item.w"
        :h="item.h"
        :i="item.i"
        :min-h="item.minH"
        :min-w="item.minW"
        :max-h="item.maxH"
        :max-w="item.maxW"
        drag-allow-from=".vue-draggable-handle"
        drag-ignore-from=".no-drag"
      >
        <q-card class="full-height scroll" flat>
          <q-slide-transition>
            <div v-show="isEditMode">
              <q-toolbar
                class="vue-draggable-handle dashboard-edit-toolbar bg-grey-2 q-pr-none"
                style="min-height: 30px"
              >
                <q-icon name="mdi-drag" size="sm" />
                <q-toolbar-title class="text-subtitle2">
                  {{ item.title }}
                </q-toolbar-title>
              </q-toolbar>
            </div>
          </q-slide-transition>
          <q-card-section class="no-drag">
            <component
              :is="widgetRegistry[item.widget as WidgetKey]"
              :data="{
                total: 18,
                confirmed: 14,
                pending: 3,
                completed: 1,
                variation: 12,
              }"
            />
          </q-card-section>
        </q-card>
      </GridItem>
    </GridLayout>
  </client-only>
</template>
<script setup lang="ts">
import TodayAppointmentsCard from "./widgets/TodayAppointmentsCard.vue";
import ProjectedRevenueCard from "./widgets/ProjectedRevenueCard.vue";
import OccupancyRateCard from "./widgets/OccupancyRateCard.vue";
import CancellationsCard from "./widgets/CancellationsCard.vue";
import DailySchedule from "./widgets/DailySchedule.vue";
import AppointmentStatusChart from "./widgets/AppointmentStatusChart.vue";
import TopServicesChart from "./widgets/TopServicesChart.vue";
import AppointmentsRevenueChart from "./widgets/AppointmentsRevenueChart.vue";
import {
  GridItem,
  GridLayout,
  type Breakpoint,
  type Layout,
  type LayoutItem,
} from "grid-layout-plus";

type WidgetKey =
  | "todayAppointments"
  | "projectedRevenue"
  | "occupancyRate"
  | "cancellations"
  | "dailySchedule"
  | "appointmentStatus"
  | "topServices"
  | "appointmentsRevenue";

export interface PanelLayoutItem extends LayoutItem {
  widget?: WidgetKey;
  title?: string;
}

const widgetRegistry = {
  todayAppointments: TodayAppointmentsCard,
  projectedRevenue: ProjectedRevenueCard,
  occupancyRate: OccupancyRateCard,
  cancellations: CancellationsCard,
  dailySchedule: DailySchedule,
  appointmentStatus: AppointmentStatusChart,
  topServices: TopServicesChart,
  appointmentsRevenue: AppointmentsRevenueChart,
} satisfies Record<WidgetKey, Component>;

const presetLayouts = reactive<Record<Breakpoint, PanelLayoutItem[]>>({
  lg: [
    {
      x: 0,
      y: 0,
      w: 3,
      h: 3,
      i: "1",
      moved: false,
      minH: 3,
      minW: 3,
      maxH: 3,
      maxW: 3,
      widget: "todayAppointments",
      title: "Serviços mais agendados",
    },
    {
      x: 3,
      y: 0,
      w: 3,
      h: 3,
      i: "2",
      moved: false,
      minH: 3,
      minW: 3,
      maxH: 3,
      maxW: 3,
      widget: "projectedRevenue",
      title: "Receita prevista",
    },
    {
      x: 6,
      y: 0,
      w: 3,
      h: 3,
      i: "3",
      moved: false,
      minH: 3,
      minW: 3,
      maxH: 3,
      maxW: 3,
      widget: "occupancyRate",
      title: "Taxa de ocupação",
    },
    {
      x: 9,
      y: 0,
      w: 3,
      h: 3,
      i: "4",
      moved: false,
      widget: "cancellations",
      title: "Cancelamentos e faltas",
    },
    {
      x: 0,
      y: 3,
      w: 7,
      h: 8,
      i: "5",
      moved: false,
      widget: "dailySchedule",
      title: "Agenda de hoje",
    },
    {
      x: 7,
      y: 3,
      w: 5,
      h: 4,
      i: "6",
      moved: false,
      widget: "appointmentStatus",
      title: "Status dos agendamentos",
    },
    {
      x: 7,
      y: 7,
      w: 5,
      h: 4,
      i: "7",
      moved: false,
      widget: "topServices",
      title: "Serviços mais agendados",
    },
    {
      x: 0,
      y: 11,
      w: 12,
      h: 4,
      i: "8",
      moved: false,
      minH: 3,
      minW: 3,
      maxH: 4,
      maxW: 12,
      widget: "appointmentsRevenue",
      title: "Evolução de agendamentos e receita",
    },
  ],
  md: [
    { x: 0, y: 0, w: 5, h: 3, i: "0" },
    { x: 5, y: 0, w: 5, h: 3, i: "2" },
    { x: 0, y: 3, w: 5, h: 3, i: "3" },
    { x: 5, y: 3, w: 5, h: 3, i: "5" },
    { x: 0, y: 6, w: 6, h: 8, i: "6" },
    { x: 6, y: 6, w: 4, h: 4, i: "7" },
    { x: 6, y: 10, w: 4, h: 4, i: "4" },
    { x: 0, y: 14, w: 10, h: 3, i: "1" },
  ],
  sm: [
    { x: 0, y: 0, w: 3, h: 3, i: "0" },
    { x: 3, y: 0, w: 3, h: 3, i: "2" },
    { x: 0, y: 3, w: 3, h: 3, i: "3" },
    { x: 3, y: 3, w: 3, h: 3, i: "5" },
    { x: 0, y: 6, w: 6, h: 7, i: "6" },
    { x: 0, y: 13, w: 3, h: 4, i: "7" },
    { x: 3, y: 13, w: 3, h: 4, i: "4" },
    { x: 0, y: 17, w: 6, h: 3, i: "1" },
  ],
  xs: [
    { x: 0, y: 0, w: 2, h: 2, i: "0" },
    { x: 2, y: 0, w: 2, h: 2, i: "2" },
    { x: 0, y: 2, w: 2, h: 2, i: "3" },
    { x: 2, y: 2, w: 2, h: 2, i: "5" },
    { x: 0, y: 4, w: 4, h: 6, i: "6" },
    { x: 0, y: 10, w: 4, h: 3, i: "7" },
    { x: 0, y: 13, w: 4, h: 4, i: "4" },
    { x: 0, y: 17, w: 4, h: 3, i: "1" },
  ],
  xxs: [
    { x: 0, y: 0, w: 2, h: 2, i: "0" },
    { x: 0, y: 2, w: 2, h: 2, i: "2" },
    { x: 0, y: 4, w: 2, h: 2, i: "3" },
    { x: 0, y: 6, w: 2, h: 2, i: "5" },
    { x: 0, y: 8, w: 2, h: 5, i: "6" },
    { x: 0, y: 13, w: 2, h: 3, i: "7" },
    { x: 0, y: 16, w: 2, h: 3, i: "4" },
    { x: 0, y: 19, w: 2, h: 2, i: "1" },
  ],
});

const layout = ref(presetLayouts.lg);
const isEditMode = ref<boolean>(false);
const rowHeight = ref<number>(50);
const gridColumns = {
  lg: 12,
  md: 10,
  sm: 6,
  xs: 4,
  xxs: 2,
} satisfies Record<Breakpoint, number>;
const colNum = ref<number>(gridColumns.lg);
const gridMargin = 10;
const gridStyle = computed(() => ({
  "--dashboard-grid-columns": colNum.value,
  "--dashboard-grid-row-size": `${rowHeight.value + gridMargin}px`,
}));

const breakpoint = ref<Breakpoint>("lg");
function breakpointChangedEvent(newBreakpoint: Breakpoint, newLayout: Layout) {
  console.info(
    "BREAKPOINT CHANGED breakpoint=",
    newBreakpoint,
    ", layout: ",
    newLayout,
  );
  breakpoint.value = newBreakpoint;
  colNum.value = gridColumns[newBreakpoint];
}

function toggleEditMode(enabled: boolean) {
  isEditMode.value = enabled;
}
</script>

<style scoped lang="sass">
@use '@/assets/styles/colors.sass' as *

.vgl-layout
  background-color: #fff
  border-radius: $generic-border-radius
  overflow: hidden

.vgl-layout--editing::before
  position: absolute
  inset: 5px
  content: ''
  pointer-events: none
  box-sizing: border-box
  border: 1px solid $grey-3
  border-radius: $generic-border-radius
  background-image: linear-gradient(to left, $grey-3 1px, transparent 1px), linear-gradient(to top, $grey-3 1px, transparent 1px)
  background-clip: padding-box
  background-repeat: repeat
  background-size: calc(100% / var(--dashboard-grid-columns)) var(--dashboard-grid-row-size)

:deep(.vgl-item:not(.vgl-item--placeholder))
  background-color: $grey-1
  border: 1px solid $grey-3
  border-radius: $generic-border-radius


:deep(.vgl-item--resizing)
  opacity: 90%


:deep(.vgl-item--static)
  background-color: #cce
</style>
