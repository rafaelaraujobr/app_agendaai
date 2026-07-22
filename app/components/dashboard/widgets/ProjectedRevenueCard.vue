<template>
  <div class="today-appointments-card full-height">
    <template v-if="loading">
      <div class="row no-wrap items-start justify-between">
        <!-- Ícone, título e valor -->
        <div class="row no-wrap items-start">
          <q-skeleton
            animation="wave"
            type="rect"
            width="46px"
            height="46px"
            class="dashboard-card__icon"
          />

          <div class="q-mx-md">
            <q-skeleton
              animation="wave"
              type="text"
              width="135px"
              height="18px"
            />

            <q-skeleton
              animation="wave"
              type="text"
              width="52px"
              height="36px"
              class="q-mt-xs"
            />
          </div>
        </div>

        <!-- Mini gráfico -->
        <q-skeleton
          animation="wave"
          type="rect"
          width="105px"
          height="52px"
          class="dashboard-card__chart"
        />
      </div>

      <!-- Resumo dos status -->
      <div class="row items-center q-col-gutter-md q-mt-sm">
        <div class="col">
          <q-skeleton animation="wave" type="text" width="100%" height="16px" />
        </div>

        <div class="col">
          <q-skeleton animation="wave" type="text" width="100%" height="16px" />
        </div>

        <div class="col">
          <q-skeleton animation="wave" type="text" width="100%" height="16px" />
        </div>
      </div>

      <!-- Comparação com período anterior -->
      <q-skeleton
        animation="wave"
        type="rect"
        width="100%"
        height="28px"
        class="q-mt-sm"
      />
    </template>

    <!-- Conteúdo real -->
    <template v-else>
      <div class="row no-wrap items-start justify-between">
        <div class="row no-wrap items-start">
          <div
            class="dashboard-card__icon row items-center justify-center bg-deep-purple-1 text-primary"
          >
            <q-icon name="mdi-calendar-check-outline" size="25px" />
          </div>

          <div class="q-ml-md">
            <div class="text-caption text-weight-medium">
              Agendamentos de hoje
            </div>

            <div class="text-h4 text-weight-bold">
              {{ data.total }}
            </div>
          </div>
        </div>

        <div class="dashboard-card__chart">
          <!-- Futuro componente ECharts -->
        </div>
      </div>

      <div class="row items-center q-col-gutter-md q-mt-sm text-caption">
        <div class="col">
          <strong>{{ data.confirmed }}</strong>
          confirmados
        </div>

        <div class="col">
          <strong>{{ data.pending }}</strong>
          pendentes
        </div>

        <div class="col">
          <strong>{{ data.completed }}</strong>
          concluídos
        </div>
      </div>

      <div
        class="dashboard-card__comparison row inline items-center q-mt-sm q-px-sm q-py-xs"
      >
        <q-icon
          :name="variationIcon"
          :color="variationColor"
          size="16px"
          class="q-mr-xs"
        />

        <span class="text-caption">
          {{ variationText }}
        </span>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
interface TodayAppointmentsData {
  total: number;
  confirmed: number;
  pending: number;
  completed: number;
  variation: number;
}

const props = withDefaults(
  defineProps<{
    loading?: boolean;
    data?: TodayAppointmentsData;
  }>(),
  {
    loading: true,
    data: () => ({
      total: 0,
      confirmed: 0,
      pending: 0,
      completed: 0,
      variation: 0,
    }),
  },
);

const variationIcon = computed(() =>
  props.data.variation >= 0 ? "mdi-trending-up" : "mdi-trending-down",
);

const variationColor = computed(() =>
  props.data.variation >= 0 ? "positive" : "negative",
);

const variationText = computed(() => {
  const variation = Math.abs(props.data.variation);

  return `${variation}% em relação ao mesmo dia da semana passada`;
});
</script>

<style scoped lang="sass">
.today-appointments-card
  min-width: 0

.dashboard-card__icon
  flex: 0 0 auto
  width: 46px
  height: 46px
  border-radius: 10px

.dashboard-card__chart
  flex: 0 1 105px
  min-width: 75px
  max-width: 105px
  border-radius: 8px

.dashboard-card__comparison
  max-width: 100%
  border-radius: 6px
  background-color: rgba(33, 186, 69, 0.1)

@media (max-width: 599px)
  .dashboard-card__chart
    display: none
</style>
