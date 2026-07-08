<template>
  <OnboardingStepCard
    title="Canais de atendimento"
    subtitle="Onde os clientes podem lhe encontrar."
    :animation-data="SocialAnimation"
    :animation-height="300"
    :animation-width="300"
  >
    <q-form ref="formRef" @submit.prevent="handleSubmit">
      <div class="q-pt-md">
        <label class="text-weight-medium text-subtitle2 q-mb-xs">
          Seus canais
        </label>
        <div class="scroll-y" style="max-height: 300px">
          <div
            v-for="(channel, index) in channels"
            :key="index"
            class="row"
          >
            <div class="col-12">
              <q-input
                :ref="(el) => setChannelInputRef(el, index)"
                v-model="channel.value"
                outlined
                bg-color="grey-1"
                :placeholder="
                  channelOptions.find((c) => c.value === channel.type)
                    ?.placeholder
                "
                maxlength="50"
                dense
                :rules="[
                  (val) =>
                    (val !== null && val !== '') || 'O canal é obrigatório',
                  (val) => val.length <= 50 || 'Máximo de 50 caracteres',
                  (val) => val.length >= 3 || 'Mínimo de 3 caracteres',
                ]"
              >
                <template #before>
                  <q-select
                    v-model="channel.type"
                    :options="availableChannelOptions(index)"
                    dropdown-icon="mdi-chevron-down"
                    option-value="value"
                    option-label="name"
                    emit-value
                    map-options
                    outlined
                    bg-color="grey-1"
                    style="width: 72px"
                    dense
                    :rules="[
                      (val) =>
                        (val !== null && val !== '') ||
                        'Tipo do canal é obrigatório',
                    ]"
                    @update:model-value="updateChannel(index)"
                  >
                  <template #selected-item="{ opt }">
                    <q-item-section>
                      <q-icon
                        :name="opt.icon"
                        size="sm"
                        :style="{ color: opt.color }"
                      />
                    </q-item-section>
                  </template>
                  <template #option="{ itemProps, opt }">
                    <q-item v-bind="itemProps">
                      <q-item-section side>
                        <q-icon
                          :name="opt.icon"
                          :style="{ color: opt.color }"
                        />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>{{ opt.name }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                  </q-select>
                </template>
                <template #after>
                  <q-btn
                    icon="mdi-trash-can-outline"
                    dense
                    :disable="channels.length === 1"
                    no-caps
                    text-color="negative"
                    padding="sm"
                    @click="removeChannel(index)"
                  />
                </template>
              </q-input>
            </div>
          </div>
        </div>
        <q-btn
          icon="mdi-plus"
          class="full-width border-xs-grey-5 bg-transparent text-primary"
          style="border-style: dashed !important; border-width: 2px !important"
          label="Adicionar outro canal"
          dense
          no-caps
          flat
          padding="sm"
          @click="addChannel"
        />
      </div>
    </q-form>

    <template #actions>
      <q-btn
        label="Voltar"
        unelevated
        no-caps
        dense
        padding="sm lg"
        flat
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
import type { ComponentPublicInstance } from "vue";
import SocialAnimation from "~/assets/lotties/social_media.json";
import type {
  OnboardingChannel,
  OnboardingChannelOption,
} from "~/composables/useOnboarding";
import OnboardingStepCard from "./OnboardingStepCard.vue";

const props = defineProps<{
  channelOptions: OnboardingChannelOption[];
}>();

const emit = defineEmits<{
  next: [];
  previous: [];
}>();

const $q = useQuasar();
const formRef = ref<QForm | null>(null);
const channels = defineModel<OnboardingChannel[]>("channels", {
  required: true,
});
const channelInputRefs = ref<ComponentPublicInstance[]>([]);

const setChannelInputRef = (
  el: Element | ComponentPublicInstance | null,
  index: number,
) => {
  if (el && "$el" in el) {
    channelInputRefs.value[index] = el;
  }
};

const addChannel = () => {
  if (channels.value.length >= 5) {
    $q.notify({
      type: "negative",
      message: "Você só pode adicionar no máximo 5 canais de divulgação",
    });
    return;
  }
  channels.value.push({ type: "", value: "" });
};

const availableChannelOptions = (index: number) => {
  const selectedNames = channels.value
    .map((channel, currentIndex) =>
      currentIndex !== index ? channel.type : null,
    )
    .filter(Boolean);

  return props.channelOptions.filter(
    (channel) => !selectedNames.includes(channel.value),
  );
};

const removeChannel = (index: number) => {
  if (channels.value.length === 1) {
    $q.notify({
      type: "negative",
      message: "Você deve adicionar pelo menos um canal de divulgação",
    });
    return;
  }
  channels.value.splice(index, 1);
};

const updateChannel = (index: number) => {
  nextTick(() => {
    channelInputRefs.value[index]?.$el?.focus?.();
  });
};

const handleSubmit = async () => {
  const isValid = await formRef.value?.validate();
  if (!isValid) return;

  emit("next");
};
</script>
