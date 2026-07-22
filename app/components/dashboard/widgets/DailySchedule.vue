<template>
  <section class="daily-schedule full-height column no-wrap">
    <!-- Estado de carregamento -->
    <template v-if="loading">
      <div class="row items-center justify-between q-mb-md">
        <div>
          <q-skeleton
            type="text"
            width="260px"
            height="24px"
            animation="wave"
          />

          <div class="row q-gutter-md q-mt-sm">
            <q-skeleton
              v-for="item in 3"
              :key="item"
              type="text"
              width="75px"
              height="16px"
              animation="wave"
            />
          </div>
        </div>

        <div class="row items-center q-gutter-xs">
          <q-skeleton
            type="rect"
            width="130px"
            height="34px"
            animation="wave"
          />

          <q-skeleton type="rect" width="34px" height="34px" animation="wave" />

          <q-skeleton type="rect" width="34px" height="34px" animation="wave" />
        </div>
      </div>

      <div class="daily-schedule__scroll col">
        <div class="daily-schedule__grid" :style="gridStyle">
          <!-- Cabeçalho dos horários -->
          <div />

          <q-skeleton
            v-for="hour in hours"
            :key="`hour-${hour}`"
            type="text"
            width="30px"
            height="18px"
            animation="wave"
            class="justify-self-center"
          />

          <!-- Linhas dos profissionais -->
          <template v-for="professional in skeletonRows" :key="professional">
            <div class="row items-center no-wrap q-pr-md">
              <q-skeleton type="circle" size="32px" animation="wave" />

              <q-skeleton
                type="text"
                width="85px"
                height="18px"
                animation="wave"
                class="q-ml-sm"
              />
            </div>

            <q-skeleton
              v-for="hour in hours"
              :key="`${professional}-${hour}`"
              type="rect"
              height="34px"
              animation="wave"
              class="daily-schedule__slot-skeleton"
            />
          </template>
        </div>
      </div>
    </template>

    <!-- Conteúdo carregado -->
    <template v-else>
      <div class="row items-start justify-between q-mb-md">
        <div>
          <div class="text-subtitle1 text-weight-bold">Agenda de hoje</div>

          <div class="text-caption text-grey-7">
            Ocupação por horário e profissional
          </div>

          <div class="row items-center q-gutter-md q-mt-sm">
            <div
              v-for="legend in legends"
              :key="legend.label"
              class="row items-center no-wrap"
            >
              <span class="daily-schedule__legend" :class="legend.className" />

              <span class="text-caption text-grey-8">
                {{ legend.label }}
              </span>
            </div>
          </div>
        </div>

        <div class="row items-center q-gutter-xs">
          <q-btn
            outline
            no-caps
            dense
            icon="mdi-calendar-outline"
            :label="dateLabel"
            class="q-px-sm"
          />

          <q-btn
            flat
            round
            dense
            icon="chevron_left"
            aria-label="Dia anterior"
            @click="emit('previous-day')"
          />

          <q-btn
            flat
            round
            dense
            icon="chevron_right"
            aria-label="Próximo dia"
            @click="emit('next-day')"
          />
        </div>
      </div>

      <div class="daily-schedule__scroll col">
        <div class="daily-schedule__grid" :style="gridStyle">
          <!-- Cabeçalho -->
          <div />

          <div
            v-for="hour in hours"
            :key="hour"
            class="text-caption text-weight-medium text-center"
          >
            {{ hour }}
          </div>

          <!-- Agenda -->
          <template
            v-for="professional in professionals"
            :key="professional.id"
          >
            <div class="row items-center no-wrap q-pr-md">
              <q-avatar size="32px">
                <img
                  v-if="professional.avatarUrl"
                  :src="professional.avatarUrl"
                  :alt="`Foto de ${professional.name}`"
                />

                <div
                  v-else
                  class="full-width full-height row items-center justify-center bg-primary text-white text-caption"
                >
                  {{ getInitials(professional.name) }}
                </div>
              </q-avatar>

              <div class="q-ml-sm ellipsis text-caption text-weight-medium">
                {{ professional.name }}
              </div>
            </div>

            <button
              v-for="hour in hours"
              :key="`${professional.id}-${hour}`"
              type="button"
              class="daily-schedule__slot"
              :class="getSlotClass(professional, hour)"
              :aria-label="getSlotLabel(professional, hour)"
              @click="handleSlotClick(professional, hour)"
            >
              <q-tooltip>
                {{ getSlotLabel(professional, hour) }}
              </q-tooltip>
            </button>
          </template>
        </div>

        <div
          v-if="!professionals.length"
          class="full-height column items-center justify-center text-grey-6"
        >
          <q-icon name="mdi-calendar-blank-outline" size="40px" />

          <div class="q-mt-sm">Nenhum profissional encontrado</div>
        </div>
      </div>
    </template>
  </section>
</template>

<script setup lang="ts">
interface ScheduleSlot {
  hour: string;
  status: "available" | "booked" | "pending";
  customerName?: string;
  serviceName?: string;
}

interface ScheduleProfessional {
  id: string;
  name: string;
  avatarUrl?: string;
  slots: ScheduleSlot[];
}

const props = withDefaults(
  defineProps<{
    loading?: boolean;
    dateLabel?: string;
    hours?: string[];
    professionals?: ScheduleProfessional[];
  }>(),
  {
    loading: true,
    dateLabel: "Hoje",
    hours: () => ["09h", "10h", "11h", "13h", "14h", "15h", "16h", "17h"],
    professionals: () => [],
  },
);

const emit = defineEmits<{
  "previous-day": [];
  "next-day": [];
  "slot-click": [
    payload: {
      professional: ScheduleProfessional;
      hour: string;
      slot?: ScheduleSlot;
    },
  ];
}>();

const skeletonRows = [1, 2, 3, 4, 5, 6, 7];

const legends = [
  {
    label: "Agendado",
    className: "daily-schedule__legend--booked",
  },
  {
    label: "Livre",
    className: "daily-schedule__legend--available",
  },
  {
    label: "Pendente",
    className: "daily-schedule__legend--pending",
  },
];

const gridStyle = computed(() => ({
  "--schedule-hours": props.hours.length,
}));

function findSlot(
  professional: ScheduleProfessional,
  hour: string,
): ScheduleSlot | undefined {
  return professional.slots.find((slot) => slot.hour === hour);
}

function getSlotClass(
  professional: ScheduleProfessional,
  hour: string,
): string {
  const slot = findSlot(professional, hour);

  return `daily-schedule__slot--${slot?.status ?? "available"}`;
}

function getSlotLabel(
  professional: ScheduleProfessional,
  hour: string,
): string {
  const slot = findSlot(professional, hour);

  if (!slot || slot.status === "available") {
    return `${professional.name}, ${hour}: horário disponível`;
  }

  const status = slot.status === "booked" ? "Agendado" : "Pendente";

  const details = [slot.customerName, slot.serviceName]
    .filter(Boolean)
    .join(" — ");

  return `${professional.name}, ${hour}: ${status}${
    details ? ` — ${details}` : ""
  }`;
}

function handleSlotClick(professional: ScheduleProfessional, hour: string) {
  emit("slot-click", {
    professional,
    hour,
    slot: findSlot(professional, hour),
  });
}

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
}
</script>

<style scoped lang="sass">
.daily-schedule
  min-width: 0

.daily-schedule__scroll
  min-height: 0
  overflow: auto

.daily-schedule__grid
  display: grid
  grid-template-columns: 145px repeat(var(--schedule-hours), minmax(48px, 1fr))
  align-items: center
  gap: 12px 8px

.daily-schedule__slot,
.daily-schedule__slot-skeleton
  width: 90%
  height: 34px
  border-radius: 8px

.daily-schedule__slot
  display: block
  padding: 0
  border: 1px solid transparent
  cursor: pointer
  transition: transform 150ms ease, filter 150ms ease

  &:hover
    filter: brightness(0.97)
    transform: translateY(-1px)

  &:focus-visible
    outline: 2px solid var(--q-primary)
    outline-offset: 2px

.daily-schedule__slot--booked
  background: rgba(124, 77, 255, 0.72)

.daily-schedule__slot--available
  background: #eeeeee
  border-color: #e0e0e0

.daily-schedule__slot--pending
  background: rgba(255, 183, 77, 0.78)

.daily-schedule__legend
  display: inline-block
  width: 10px
  height: 10px
  margin-right: 6px
  border-radius: 3px

.daily-schedule__legend--booked
  background: rgba(124, 77, 255, 0.72)

.daily-schedule__legend--available
  background: #eeeeee
  border: 1px solid #e0e0e0

.daily-schedule__legend--pending
  background: rgba(255, 183, 77, 0.78)

@media (max-width: 599px)
  .daily-schedule__grid
    grid-template-columns: 115px repeat(var(--schedule-hours), 46px)
</style>
