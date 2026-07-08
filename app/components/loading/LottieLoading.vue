<script setup lang="ts">
import { computed } from 'vue'
import loadingAnimation from '@/assets/lotties/loading.json'

const props = withDefaults(defineProps<{
  size?: string | number
}>(), {
  size: 96
})

const normalizedSize = computed(() => {
  return typeof props.size === 'number'
    ? `${props.size}px`
    : props.size
})
</script>

<template>
  <div class="column items-center justify-center">
    <CommonLottieAnimation
      :animation-data="loadingAnimation"
      :width="normalizedSize"
      :height="normalizedSize"
      :loop="true"
      :auto-play="true"
    />
  </div>
</template>
