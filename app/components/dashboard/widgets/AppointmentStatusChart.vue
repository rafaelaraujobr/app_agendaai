<template>
  <section class="appointment-status full-height column no-wrap">
    <!-- Carregamento -->
    <template v-if="loading">
      <div class="q-mb-md">
        <q-skeleton type="text" width="190px" height="24px" animation="wave" />

        <q-skeleton
          type="text"
          width="135px"
          height="16px"
          animation="wave"
          class="q-mt-xs"
        />
      </div>

      <div class="appointment-status__content col row items-center no-wrap">
        <div class="appointment-status__chart-skeleton">
          <q-skeleton type="circle" size="130px" animation="wave" />
        </div>

        <div class="appointment-status__legend col q-ml-lg">
          <div
            v-for="item in 4"
            :key="item"
            class="row items-center no-wrap q-mb-sm"
          >
            <q-skeleton type="circle" size="10px" animation="wave" />

            <q-skeleton
              type="text"
              width="90px"
              height="18px"
              animation="wave"
              class="q-ml-sm"
            />

            <q-space />

            <q-skeleton
              type="text"
              width="25px"
              height="18px"
              animation="wave"
            />
          </div>
        </div>
      </div>
    </template>

    <!-- Conteúdo carregado -->
    <template v-else>
      <div class="row items-start justify-between q-mb-sm">
        <div>
          <div class="text-subtitle1 text-weight-bold">
            Status dos agendamentos
          </div>

          <div class="text-caption text-grey-7">
            Distribuição dos atendimentos de hoje
          </div>
        </div>

        <q-btn
          flat
          round
          dense
          icon="mdi-dots-horizontal"
          aria-label="Mais opções"
        />
      </div>

      <div
        v-if="hasAppointments"
        class="appointment-status__content col row items-center no-wrap"
      >
        <div class="appointment-status__chart">
          <client-only>
            <v-chart
              :option="chartOptions"
              autoresize
              class="full-width full-height"
              @click="handleChartClick"
            />

            <template #fallback>
              <div class="full-height row items-center justify-center">
                <q-spinner color="primary" size="32px" />
              </div>
            </template>
          </client-only>
        </div>

        <div class="appointment-status__legend col">
          <button
            v-for="item in statusItems"
            :key="item.key"
            type="button"
            class="appointment-status__legend-item"
            @click="handleStatusClick(item.key)"
          >
            <span
              class="appointment-status__dot"
              :style="{ backgroundColor: item.color }"
            />

            <span class="appointment-status__label">
              {{ item.label }}
            </span>

            <span class="appointment-status__value">
              {{ item.value }}
            </span>

            <span class="appointment-status__percentage">
              {{ item.percentage }}%
            </span>

            <q-tooltip>
              {{ item.value }}
              {{ item.value === 1 ? "agendamento" : "agendamentos" }}
            </q-tooltip>
          </button>
        </div>
      </div>

      <!-- Sem dados -->
      <div v-else class="col column items-center justify-center text-grey-6">
        <q-icon name="mdi-chart-donut" size="44px" />

        <div class="text-body2 text-weight-medium q-mt-sm">
          Nenhum agendamento hoje
        </div>

        <div class="text-caption">
          Os status aparecerão aqui quando houver agendamentos.
        </div>
      </div>
    </template>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import VChart from "vue-echarts";
import { use } from "echarts/core";
import type { EChartsOption } from "echarts";
import { PieChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
import { TitleComponent, TooltipComponent } from "echarts/components";

use([CanvasRenderer, PieChart, TitleComponent, TooltipComponent]);

type AppointmentStatusKey =
  | "confirmed"
  | "pending"
  | "completed"
  | "canceled"
  | "noShow";

interface AppointmentStatusData {
  confirmed: number;
  pending: number;
  completed: number;
  canceled: number;
  noShow: number;
}

interface StatusItem {
  key: AppointmentStatusKey;
  label: string;
  value: number;
  percentage: number;
  color: string;
}

const props = withDefaults(
  defineProps<{
    loading?: boolean;
    data?: AppointmentStatusData;
  }>(),
  {
    loading: true,
    data: () => ({
      confirmed: 0,
      pending: 0,
      completed: 0,
      canceled: 0,
      noShow: 0,
    }),
  },
);

const emit = defineEmits<{
  "status-click": [status: AppointmentStatusKey];
}>();

const $q = useQuasar();

const totalAppointments = computed(() =>
  Object.values(props.data).reduce((total, value) => total + value, 0),
);

const hasAppointments = computed(() => totalAppointments.value > 0);

const calculatePercentage = (value: number): number => {
  if (!totalAppointments.value) {
    return 0;
  }

  return Math.round((value / totalAppointments.value) * 100);
};

const statusItems = computed<StatusItem[]>(() => [
  {
    key: "confirmed",
    label: "Confirmados",
    value: props.data.confirmed,
    percentage: calculatePercentage(props.data.confirmed),
    color: "#5b5fef",
  },
  {
    key: "pending",
    label: "Pendentes",
    value: props.data.pending,
    percentage: calculatePercentage(props.data.pending),
    color: "#f59e0b",
  },
  {
    key: "completed",
    label: "Concluídos",
    value: props.data.completed,
    percentage: calculatePercentage(props.data.completed),
    color: "#22c55e",
  },
  {
    key: "canceled",
    label: "Cancelados",
    value: props.data.canceled,
    percentage: calculatePercentage(props.data.canceled),
    color: "#ef4444",
  },
  {
    key: "noShow",
    label: "Não compareceram",
    value: props.data.noShow,
    percentage: calculatePercentage(props.data.noShow),
    color: "#9ca3af",
  },
]);

const chartOptions = computed<EChartsOption>(() => {
  const textColor = $q.dark.isActive ? "#ffffff" : "#111827";

  const secondaryTextColor = $q.dark.isActive ? "#9ca3af" : "#6b7280";

  return {
    animationDuration: 500,

    tooltip: {
      trigger: "item",
      formatter: (params: any) =>
        `${params.name}<br/><strong>${params.value}</strong> agendamentos (${params.percent}%)`,
    },

    title: {
      text: String(totalAppointments.value),
      subtext: "agendamentos",
      left: "center",
      top: "34%",
      textStyle: {
        color: textColor,
        fontSize: 25,
        fontWeight: 700,
      },
      subtextStyle: {
        color: secondaryTextColor,
        fontSize: 11,
      },
    },

    series: [
      {
        name: "Status",
        type: "pie",
        radius: ["58%", "78%"],
        center: ["50%", "50%"],
        avoidLabelOverlap: true,

        itemStyle: {
          borderColor: $q.dark.isActive ? "#1d1d1d" : "#ffffff",
          borderWidth: 3,
          borderRadius: 5,
        },

        label: {
          show: false,
        },

        labelLine: {
          show: false,
        },

        emphasis: {
          scale: true,
          scaleSize: 5,
        },

        data: statusItems.value.map((item) => ({
          name: item.label,
          value: item.value,
          itemStyle: {
            color: item.color,
          },
        })),
      },
    ],
  };
});

function handleStatusClick(status: AppointmentStatusKey): void {
  emit("status-click", status);
}

function handleChartClick(params: { name?: string }): void {
  const selectedStatus = statusItems.value.find(
    (item) => item.label === params.name,
  );

  if (selectedStatus) {
    handleStatusClick(selectedStatus.key);
  }
}
</script>

<style scoped lang="sass">
.appointment-status
  min-width: 0
  min-height: 0

.appointment-status__content
  min-height: 120px

.appointment-status__chart,
.appointment-status__chart-skeleton
  flex: 0 0 48%
  width: 48%
  height: 120px

.appointment-status__chart-skeleton
  display: flex
  align-items: center
  justify-content: center

.appointment-status__legend
  min-width: 0

.appointment-status__legend-item
  display: grid
  grid-template-columns: 10px minmax(90px, 1fr) auto 40px
  align-items: center
  gap: 8px
  width: 100%
  min-height: 32px
  padding: 4px 6px
  border: 0
  border-radius: 6px
  color: inherit
  background: transparent
  cursor: pointer
  text-align: left
  transition: background-color 150ms ease

  &:hover
    background-color: rgba(0, 0, 0, 0.04)

  &:focus-visible
    outline: 2px solid var(--q-primary)
    outline-offset: 1px

.appointment-status__dot
  width: 10px
  height: 10px
  border-radius: 50%

.appointment-status__label
  overflow: hidden
  font-size: 12px
  text-overflow: ellipsis
  white-space: nowrap

.appointment-status__value
  font-size: 13px
  font-weight: 700

.appointment-status__percentage
  color: #6b7280
  font-size: 11px
  text-align: right

.body--dark
  .appointment-status__legend-item:hover
    background-color: rgba(255, 255, 255, 0.06)

@media (max-width: 599px)
  .appointment-status__content
    flex-direction: column

  .appointment-status__chart,
  .appointment-status__chart-skeleton
    flex-basis: auto
    width: 100%
    height: 170px

  .appointment-status__legend
    width: 100%
    margin-top: 8px
</style>
