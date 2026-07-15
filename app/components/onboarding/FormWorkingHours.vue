<template>
  <OnboardingStepCard
    title="Horário de funcionamento"
    subtitle="Defina os dias e horários em que seu negócio atende."
    :animation-data="WorkingHoursAnimation"
  >
    <q-form ref="formRef" @submit.prevent="handleSubmit">
      <div class="q-gutter-y-sm q-mb-md">
        <div class="text-caption text-grey-7">
          Escolha um modelo rápido. Se precisar, toque em um dia para ajustar.
        </div>
        <div class="row q-col-gutter-sm">
          <div
            v-for="preset in workingHourPresets"
            :key="preset.value"
            class="col-12 col-sm-4"
          >
            <q-btn
              class="full-width"
              :label="preset.label"
              outline
              no-caps
              dense
              padding="sm"
              color="primary"
              @click="applyPreset(preset.value)"
            />
          </div>
        </div>
      </div>

      <q-list bordered separator class="rounded-borders bg-white">
        <q-item
          v-for="(workingHour, index) in workingHours"
          :key="workingHour.dayOfWeek"
          clickable
          @click="openEditDialog(index)"
        >
        <q-item-section>
          <q-item-label>
            <div class="row items-center q-gutter-sm no-wrap">
              <span class="text-weight-bold">
                {{ dayLabels[workingHour.dayOfWeek] }}
              </span>
              <span class="text-weight-medium">
                {{ getWorkingHourLabel(workingHour) }}
              </span>
            </div>
          </q-item-label>
          <q-item-label v-if="hasBreak(workingHour)" caption>
            Intervalo: {{ minutesToTime(workingHour.breakStartMinutes) }} às
            {{ minutesToTime(workingHour.breakEndMinutes) }}
          </q-item-label>
        </q-item-section>

        <q-item-section side>
          <div class="row items-center q-gutter-sm no-wrap">
            <q-badge
              :color="workingHour.isActive ? 'positive' : 'grey-6'"
              outline
            >
              {{ workingHour.isActive ? "Aberto" : "Fechado" }}
            </q-badge>
            <q-btn
              icon="mdi-pencil-outline"
              dense
              flat
              round
              color="primary"
              @click.stop="openEditDialog(index)"
            />
          </div>
        </q-item-section>
        </q-item>
      </q-list>
    </q-form>

    <q-dialog v-model="isEditDialogOpen">
      <q-card class="full-width">
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
                  <q-item-label caption lines="2"
                    >Configure intervalo, almoço ou descanso.</q-item-label
                  >
                </q-item-section>
                <q-item-section side>
                  <q-toggle
                    :model-value="hasBreak(editingWorkingHour)"
                    color="primary"
                    :disable="!editingWorkingHour.isActive"
                    @update:model-value="
                      toggleBreak(editingWorkingHour, $event)
                    "
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
                    bg-color="white"
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
                    bg-color="white"
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

          <q-card flat bordered class="bg-grey-1">
            <q-card-section>
              <div class="text-caption text-grey-7">Resumo</div>
              <div class="text-subtitle2">
                {{ getWorkingHourLabel(editingWorkingHour) }}
              </div>
              <div
                v-if="hasBreak(editingWorkingHour)"
                class="text-caption text-grey-7"
              >
                Intervalo:
                {{ minutesToTime(editingWorkingHour.breakStartMinutes) }} às
                {{ minutesToTime(editingWorkingHour.breakEndMinutes) }}
              </div>
            </q-card-section>
          </q-card>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn
            label="Cancelar"
            flat
            no-caps
            @click="closeEditDialog"
            dense
            padding="sm lg"
            color="primary"
          />
          <q-btn
            label="Salvar"
            unelevated
            no-caps
            color="primary"
            :disable="!!editingValidationMessage"
            @click="saveWorkingHour"
            dense
            padding="sm lg"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <template #actions>
      <q-btn
        label="Voltar"
        unelevated
        flat
        no-caps
        dense
        padding="sm lg"
        color="primary"
        @click="$emit('previous')"
      />
      <q-btn
        label="Avançar"
        unelevated
        no-caps
        dense
        padding="sm lg"
        color="primary"
        @click="handleSubmit"
      />
    </template>
  </OnboardingStepCard>
</template>

<script setup lang="ts">
import type { QForm } from "quasar";
import WorkingHoursAnimation from "~/assets/lotties/code_animation.json";
import type {
  OnboardingDayOfWeek,
  OnboardingWorkingHour,
} from "~/composables/useOnboarding";
import OnboardingStepCard from "./OnboardingStepCard.vue";

type MinuteField =
  | "startMinutes"
  | "endMinutes"
  | "breakStartMinutes"
  | "breakEndMinutes";
type WorkingHourPreset = "weekdays" | "saturday" | "everyday";

const emit = defineEmits<{
  next: [];
  previous: [];
}>();

const workingHours = defineModel<OnboardingWorkingHour[]>("workingHours", {
  required: true,
});

const $q = useQuasar();
const formRef = ref<QForm | null>(null);
const isEditDialogOpen = ref(false);
const editingIndex = ref<number | null>(null);
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

const workingHourPresets: { label: string; value: WorkingHourPreset }[] = [
  { label: "Seg a sex", value: "weekdays" },
  { label: "Seg a sáb", value: "saturday" },
  { label: "Todos os dias", value: "everyday" },
];

const minutesToTime = (minutes: number | null) => {
  if (minutes === null) return "";

  const hours = Math.floor(minutes / 60)
    .toString()
    .padStart(2, "0");
  const remainingMinutes = (minutes % 60).toString().padStart(2, "0");

  return `${hours}:${remainingMinutes}`;
};

const timeToMinutes = (time: string | number | null) => {
  if (typeof time !== "string" || !time.includes(":")) return null;

  const [hours = Number.NaN, minutes = Number.NaN] = time
    .split(":")
    .map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;

  return hours * 60 + minutes;
};

const updateMinutes = (
  workingHour: OnboardingWorkingHour,
  field: MinuteField,
  time: string | number | null,
) => {
  const minutes = timeToMinutes(time);
  if (minutes === null) return;

  workingHour[field] = minutes;
};

const hasBreak = (workingHour: OnboardingWorkingHour) => {
  return (
    workingHour.breakStartMinutes !== null &&
    workingHour.breakEndMinutes !== null
  );
};

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

  const breakStartMinutes = workingHour.breakStartMinutes;
  const breakEndMinutes = workingHour.breakEndMinutes;

  if (breakStartMinutes === null || breakEndMinutes === null) return "";

  if (breakStartMinutes >= breakEndMinutes) {
    return "O início do intervalo precisa ser antes do fim do intervalo.";
  }

  if (
    breakStartMinutes <= workingHour.startMinutes ||
    breakEndMinutes >= workingHour.endMinutes
  ) {
    return "O intervalo precisa ficar dentro do horário de funcionamento.";
  }

  return "";
};

const editingValidationMessage = computed(() => {
  return validateWorkingHour(editingWorkingHour.value);
});

const toggleBreak = (
  workingHour: OnboardingWorkingHour,
  shouldHaveBreak: boolean,
) => {
  workingHour.breakStartMinutes = shouldHaveBreak ? 720 : null;
  workingHour.breakEndMinutes = shouldHaveBreak ? 780 : null;
};

const applyPreset = (preset: WorkingHourPreset) => {
  const activeDaysByPreset: Record<WorkingHourPreset, OnboardingDayOfWeek[]> = {
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
  const activeDays = activeDaysByPreset[preset];

  workingHours.value = workingHours.value.map((workingHour) => ({
    ...workingHour,
    startMinutes: 540,
    endMinutes:
      preset === "saturday" && workingHour.dayOfWeek === "SATURDAY"
        ? 780
        : 1080,
    breakStartMinutes: null,
    breakEndMinutes: null,
    isActive: activeDays.includes(workingHour.dayOfWeek),
  }));
};

const openEditDialog = (index: number) => {
  const selectedWorkingHour = workingHours.value[index];
  if (!selectedWorkingHour) return;

  editingIndex.value = index;
  editingWorkingHour.value = { ...selectedWorkingHour };
  isEditDialogOpen.value = true;
};

const closeEditDialog = () => {
  isEditDialogOpen.value = false;
  editingIndex.value = null;
};

const saveWorkingHour = () => {
  if (editingIndex.value === null) return;
  if (editingValidationMessage.value) {
    $q.notify({
      type: "negative",
      message: editingValidationMessage.value,
    });
    return;
  }

  workingHours.value[editingIndex.value] = { ...editingWorkingHour.value };
  closeEditDialog();
};

const handleSubmit = async () => {
  const isValid = await formRef.value?.validate();
  if (!isValid) return;

  if (!workingHours.value.some((workingHour) => workingHour.isActive)) {
    $q.notify({
      type: "negative",
      message: "Configure pelo menos um dia de atendimento.",
    });
    return;
  }

  const invalidWorkingHour = workingHours.value.find((workingHour) =>
    validateWorkingHour(workingHour),
  );

  if (invalidWorkingHour) {
    $q.notify({
      type: "negative",
      message: `${dayLabels[invalidWorkingHour.dayOfWeek]}: ${validateWorkingHour(
        invalidWorkingHour,
      )}`,
    });
    return;
  }

  emit("next");
};
</script>
