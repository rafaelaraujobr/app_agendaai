<template>
  <q-card flat class="card-onboarding column">
    <q-card-section horizontal class="no-wrap col items-stretch">
      <q-card flat class="col-5 column items-center justify-center gt-xs">
        <ClientOnly>
          <div class="full-width row items-center justify-center">
            <Vue3Lottie
              :animation-data="animationData"
              :height="animationHeight"
              :width="animationWidth"
            />
          </div>
        </ClientOnly>
      </q-card>

      <q-card-section class="col-12 col-sm-7 q-px-none">
        <q-card flat class="full-height column">
          <q-card-section>
            <div class="text-h6">{{ title }}</div>
            <div v-if="subtitle" class="text-subtitle2 text-grey-7">
              {{ subtitle }}
            </div>
          </q-card-section>

          <q-card-section class="col">
            <slot />
          </q-card-section>

          <q-card-actions align="right">
            <slot name="actions" />
          </q-card-actions>
        </q-card>
      </q-card-section>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string;
    subtitle?: string;
    animationData: Record<string, unknown>;
    animationHeight?: number;
    animationWidth?: number;
  }>(),
  {
    animationHeight: 250,
    animationWidth: 250,
    subtitle: undefined,
  },
);
</script>

<style lang="sass" scoped>
@use "@/assets/styles/quasar-variables" as v
.card-onboarding
  width: 900px
  min-height: 520px

@media (max-width: $breakpoint-xs)
  .card-onboarding
    width: 100%
</style>
