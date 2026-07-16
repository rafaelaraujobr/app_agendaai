<template>
  <SettingsSectionCard
    title="Horários de atendimento"
    subtitle="Defina os dias, horários e intervalos do seu negócio."
    icon="mdi-clock-outline"
    :loading="loading"
    @save="$emit('save')"
  >
    <q-btn-toggle
      v-model="selectedPreset"
      class="full-width q-mb-md"
      :options="presetOptions"
      spread
      no-caps
      unelevated
      toggle-color="primary"
      toggle-text-color="white"
      color="grey-2"
      text-color="primary"
      @update:model-value="applyPreset"
    />

    <q-list bordered separator class="rounded-borders bg-white">
      <q-item
        v-for="(workingHour, index) in model.workingHours"
        :key="workingHour.dayOfWeek"
        clickable
        @click="openEditDialog(index)"
      >
        <q-item-section>
          <q-item-label class="text-weight-bold">
            {{ dayLabels[workingHour.dayOfWeek] }}
          </q-item-label>
          <q-item-label
            v-if="workingHour.isActive"
            class="text-weight-medium q-mt-xs"
          >
            <q-icon name="mdi-clock-outline" class="q-mr-xs" />
            {{ getWorkingHourLabel(workingHour) }}
          </q-item-label>
          <q-item-label v-else caption class="q-mt-xs">
            Sem atendimento
          </q-item-label>
          <q-item-label v-if="hasBreak(workingHour)" caption>
            Intervalo: {{ minutesToTime(workingHour.breakStartMinutes) }} às
            {{ minutesToTime(workingHour.breakEndMinutes) }}
          </q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-badge
            :color="workingHour.isActive ? 'positive' : 'grey-6'"
            outline
          >
            {{ workingHour.isActive ? "Aberto" : "Fechado" }}
          </q-badge>
        </q-item-section>

        <q-item-section side>
          <q-badge
            v-if="validateWorkingHour(workingHour)"
            color="negative"
            rounded
          >
            !
          </q-badge>
          <q-btn
            icon="mdi-pencil-outline"
            dense
            flat
            round
            color="primary"
            aria-label="Editar horário"
            @click.stop="openEditDialog(index)"
          />
        </q-item-section>
      </q-item>
    </q-list>
  </SettingsSectionCard>

  <q-dialog v-model="isEditDialogOpen" :maximized="$q.screen.lt.sm">
    <q-card class="full-width" style="max-width: 560px">
      <q-card-section>
        <div class="text-h6">
          {{ dayLabels[editingWorkingHour.dayOfWeek] }}
        </div>
        <div class="text-subtitle2 text-grey-7">
          Edite o horário de funcionamento deste dia.
        </div>
      </q-card-section>

      <q-card-section class="column q-gutter-md">
        <q-toggle
          v-model="editingWorkingHour.isActive"
          label="Atende neste dia"
          color="primary"
        />

        <q-banner
          v-if="editingValidationMessage"
          rounded
          class="bg-orange-1 text-orange-10"
        >
          {{ editingValidationMessage }}
        </q-banner>

        <div class="row q-col-gutter-sm">
          <div class="col-6">
            <q-input
              :model-value="minutesToTime(editingWorkingHour.startMinutes)"
              type="time"
              outlined
              bg-color="grey-1"
              dense
              label="Abre"
              :disable="!editingWorkingHour.isActive"
              @update:model-value="
                updateMinutes(editingWorkingHour, 'startMinutes', $event)
              "
            />
          </div>
          <div class="col-6">
            <q-input
              :model-value="minutesToTime(editingWorkingHour.endMinutes)"
              type="time"
              outlined
              bg-color="grey-1"
              dense
              label="Fecha"
              :disable="!editingWorkingHour.isActive"
              @update:model-value="
                updateMinutes(editingWorkingHour, 'endMinutes', $event)
              "
            />
          </div>
        </div>

        <q-card flat bordered class="bg-grey-1">
          <q-card-section class="q-gutter-y-md">
            <q-item dense class="q-px-none">
              <q-item-section>
                <q-item-label>Intervalo</q-item-label>
                <q-item-label caption>
                  Configure almoço, descanso ou outro intervalo.
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-toggle
                  :model-value="hasBreak(editingWorkingHour)"
                  color="primary"
                  :disable="!editingWorkingHour.isActive"
                  @update:model-value="toggleBreak(editingWorkingHour, $event)"
                />
              </q-item-section>
            </q-item>

            <div class="row q-col-gutter-sm">
              <div class="col-6">
                <q-input
                  :model-value="
                    minutesToTime(editingWorkingHour.breakStartMinutes)
                  "
                  type="time"
                  outlined
                  bg-color="grey-1"
                  dense
                  label="Início"
                  :disable="
                    !editingWorkingHour.isActive ||
                    !hasBreak(editingWorkingHour)
                  "
                  @update:model-value="
                    updateMinutes(
                      editingWorkingHour,
                      'breakStartMinutes',
                      $event,
                    )
                  "
                />
              </div>
              <div class="col-6">
                <q-input
                  :model-value="
                    minutesToTime(editingWorkingHour.breakEndMinutes)
                  "
                  type="time"
                  outlined
                  bg-color="grey-1"
                  dense
                  label="Fim"
                  :disable="
                    !editingWorkingHour.isActive ||
                    !hasBreak(editingWorkingHour)
                  "
                  @update:model-value="
                    updateMinutes(
                      editingWorkingHour,
                      'breakEndMinutes',
                      $event,
                    )
                  "
                />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right" class="q-pa-md">
        <q-btn
          label="Cancelar"
          flat
          no-caps
          color="primary"
          @click="closeEditDialog"
        />
        <q-btn
          label="Salvar horário"
          unelevated
          no-caps
          color="primary"
          :disable="Boolean(editingValidationMessage)"
          @click="saveWorkingHour"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import type {
  OnboardingDayOfWeek,
  OnboardingWorkingHour,
} from "~/composables/useOnboarding";
import type { SettingsForm } from "~/composables/useSettings";
import SettingsSectionCard from "./SettingsSectionCard.vue";

type MinuteField =
  | "startMinutes"
  | "endMinutes"
  | "breakStartMinutes"
  | "breakEndMinutes";
type WorkingHourPreset = "weekdays" | "saturday" | "everyday";

defineProps<{ loading?: boolean }>();
defineEmits<{ save: [] }>();
const model = defineModel<SettingsForm>({ required: true });
const isEditDialogOpen = ref(false);
const editingIndex = ref<number | null>(null);
const selectedPreset = ref<WorkingHourPreset | null>(null);
const editingWorkingHour = ref<OnboardingWorkingHour>({
  dayOfWeek: "MONDAY",
  startMinutes: 540,
  endMinutes: 1080,
  breakStartMinutes: 720,
  breakEndMinutes: 780,
  isActive: true,
});

const dayLabels: Record<OnboardingDayOfWeek, string> = {
  MONDAY: "Segunda",
  TUESDAY: "Terça",
  WEDNESDAY: "Quarta",
  THURSDAY: "Quinta",
  FRIDAY: "Sexta",
  SATURDAY: "Sábado",
  SUNDAY: "Domingo",
};

const presetOptions: Array<{ label: string; value: WorkingHourPreset }> = [
  { label: "Seg–Sex", value: "weekdays" },
  { label: "Seg–Sáb", value: "saturday" },
  { label: "Todos", value: "everyday" },
];

const minutesToTime = (minutes: number | null) => {
  if (minutes === null) return "";
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(
    minutes % 60,
  ).padStart(2, "0")}`;
};

const timeToMinutes = (time: string | number | null) => {
  if (typeof time !== "string" || !time.includes(":")) return null;
  const [hours = Number.NaN, minutes = Number.NaN] = time.split(":").map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;
  return hours * 60 + minutes;
};

const updateMinutes = (
  workingHour: OnboardingWorkingHour,
  field: MinuteField,
  time: string | number | null,
) => {
  const minutes = timeToMinutes(time);
  if (minutes !== null) workingHour[field] = minutes;
};

const hasBreak = (workingHour: OnboardingWorkingHour) =>
  workingHour.breakStartMinutes !== null &&
  workingHour.breakEndMinutes !== null;

const getWorkingHourLabel = (workingHour: OnboardingWorkingHour) => {
  if (!workingHour.isActive) return "Fechado";
  return `${minutesToTime(workingHour.startMinutes)} às ${minutesToTime(
    workingHour.endMinutes,
  )}`;
};

const validateWorkingHour = (workingHour: OnboardingWorkingHour) => {
  if (!workingHour.isActive) return "";
  if (workingHour.startMinutes >= workingHour.endMinutes) {
    return "O horário de abertura precisa ser antes do fechamento.";
  }
  if (!hasBreak(workingHour)) return "";
  const start = workingHour.breakStartMinutes;
  const end = workingHour.breakEndMinutes;
  if (start === null || end === null) return "";
  if (start >= end) return "O início do intervalo precisa ser antes do fim.";
  if (start <= workingHour.startMinutes || end >= workingHour.endMinutes) {
    return "O intervalo precisa ficar dentro do horário de funcionamento.";
  }
  return "";
};

const editingValidationMessage = computed(() =>
  validateWorkingHour(editingWorkingHour.value),
);

const toggleBreak = (
  workingHour: OnboardingWorkingHour,
  enabled: boolean,
) => {
  workingHour.breakStartMinutes = enabled ? 720 : null;
  workingHour.breakEndMinutes = enabled ? 780 : null;
};

const applyPreset = (preset: WorkingHourPreset) => {
  const activeDays: Record<WorkingHourPreset, OnboardingDayOfWeek[]> = {
    weekdays: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"],
    saturday: [
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
    ],
    everyday: [
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
      "SUNDAY",
    ],
  };

  model.value.workingHours = model.value.workingHours.map((workingHour) => ({
    ...workingHour,
    startMinutes: 540,
    endMinutes:
      preset === "saturday" && workingHour.dayOfWeek === "SATURDAY"
        ? 780
        : 1080,
    breakStartMinutes: null,
    breakEndMinutes: null,
    isActive: activeDays[preset].includes(workingHour.dayOfWeek),
  }));
};

const openEditDialog = (index: number) => {
  const selected = model.value.workingHours[index];
  if (!selected) return;
  editingIndex.value = index;
  editingWorkingHour.value = { ...selected };
  isEditDialogOpen.value = true;
};

const closeEditDialog = () => {
  isEditDialogOpen.value = false;
  editingIndex.value = null;
};

const saveWorkingHour = () => {
  if (editingIndex.value === null || editingValidationMessage.value) return;
  model.value.workingHours[editingIndex.value] = {
    ...editingWorkingHour.value,
  };
  selectedPreset.value = null;
  closeEditDialog();
};
</script>
