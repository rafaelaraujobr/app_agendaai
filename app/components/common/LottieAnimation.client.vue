<template>
  <Vue3Lottie
    :animation-data="animationData"
    :height="height"
    :width="width"
    :loop="loop"
    :auto-play="autoPlay"
  />
</template>

<script setup lang="ts">
import { Vue3Lottie } from "vue3-lottie";

withDefaults(
  defineProps<{
    animationData: Record<string, unknown>;
    height?: string | number;
    width?: string | number;
    loop?: boolean;
    autoPlay?: boolean;
  }>(),
  {
    autoPlay: true,
    height: undefined,
    loop: true,
    width: undefined,
  },
);
</script>
