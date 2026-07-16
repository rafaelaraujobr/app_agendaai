<template>
  <SettingsSectionCard
    title="Canais de atendimento"
    subtitle="Mantenha atualizados os canais usados pelos seus clientes."
    icon="mdi-message-text-outline"
    :loading="loading"
    @save="$emit('save')"
  >
    <div v-if="model.channels.length" class="q-gutter-y-sm q-mb-md">
      <q-input
        v-for="(channel, index) in model.channels"
        :key="index"
        v-model="channel.value"
        outlined
        bg-color="grey-1"
        :placeholder="getOption(channel.type)?.placeholder"
        maxlength="255"
        dense
      >
        <template #before>
          <q-select
            v-model="channel.type"
            :options="availableOptions(index)"
            dropdown-icon="mdi-chevron-down"
            option-value="value"
            option-label="name"
            emit-value
            map-options
            outlined
            bg-color="grey-1"
            style="width: 72px"
            dense
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
                  <q-icon :name="opt.icon" :style="{ color: opt.color }" />
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
            flat
            round
            color="negative"
            aria-label="Remover canal"
            @click="removeChannel(index)"
          />
        </template>
      </q-input>
    </div>

    <q-banner v-else rounded class="bg-grey-2 text-grey-8">
      <template #avatar>
        <q-icon name="mdi-message-off-outline" />
      </template>
      Nenhum canal configurado.
    </q-banner>

    <q-btn
      label="Adicionar canal"
      icon="mdi-plus"
      color="primary"
      flat
      no-caps
      class="full-width border-xs-grey-5 bg-transparent text-primary q-mt-md"
      style="border-style: dashed !important; border-width: 2px !important"
      :disable="model.channels.length >= channelOptions.length"
      @click="addChannel"
    />
  </SettingsSectionCard>
</template>

<script setup lang="ts">
import type {
  OnboardingChannel,
  OnboardingChannelOption,
} from "~/composables/useOnboarding";
import type { SettingsForm } from "~/composables/useSettings";
import SettingsSectionCard from "./SettingsSectionCard.vue";

const props = defineProps<{
  channelOptions: OnboardingChannelOption[];
  loading?: boolean;
}>();
defineEmits<{ save: [] }>();
const model = defineModel<SettingsForm>({ required: true });

const getOption = (type: OnboardingChannel["type"]) =>
  props.channelOptions.find((option) => option.value === type);

const availableOptions = (index: number) => {
  const selected = model.value.channels
    .filter((_, currentIndex) => currentIndex !== index)
    .map((channel) => channel.type);
  return props.channelOptions.filter((option) => !selected.includes(option.value));
};

const addChannel = () => {
  const option = props.channelOptions.find(
    (candidate) =>
      !model.value.channels.some((channel) => channel.type === candidate.value),
  );
  model.value.channels.push({ type: option?.value ?? "", value: "" });
};

const removeChannel = (index: number) => {
  model.value.channels.splice(index, 1);
};
</script>
