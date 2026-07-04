<template>
  <client-only>
    <vue-particles
      id="tsparticles"
      :options="options"
      @particlesLoaded="particlesLoaded"
    />
  </client-only>
</template>

<script setup lang="ts">
import type { Container, ISourceOptions } from "@tsparticles/engine";

const PARTICLE_COLOR = "#dffcff";

const options: ISourceOptions = {
  fullScreen: { enable: false },
  background: { color: "transparent" },
  fpsLimit: 60,
  particles: {
    number: {
      value: 620,
      density: {
        enable: true,
      },
    },
    paint: {
      color: { value: PARTICLE_COLOR },
      fill: {
        enable: true,
        color: { value: PARTICLE_COLOR },
        opacity: 1,
      },
      stroke: {
        color: { value: PARTICLE_COLOR },
        width: 0,
      },
    },
    links: {
      enable: true,
      color: "#9eefff",
      opacity: 0.08,
      distance: 45,
      width: 1,
    },
    move: {
      enable: true,
      speed: 0.35,
      direction: "right",
      random: true,
      straight: false,
      outModes: {
        default: "out",
        left: "out",
        right: "out",
        top: "bounce",
        bottom: "bounce",
      },
    },
    size: { value: { min: 0.7, max: 2.8 } },
    opacity: { value: { min: 0.2, max: 1 } },
  },
  detectRetina: true,
};

const particlesLoaded = (container?: Container) => {
  console.log("Particles wave ready", container?.id);
};
</script>

<style scoped></style>
