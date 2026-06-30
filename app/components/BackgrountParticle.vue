<template>
  <div class="particle-wave">
    <client-only>
      <vue-particles
        id="tsparticles"
        :options="options"
        @particlesLoaded="particlesLoaded"
      />
    </client-only>
  </div>
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

<style scoped>
.particle-wave {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 10;
  height: 340px;
  overflow: hidden;
  pointer-events: none !important;
  background: transparent;
}

:deep(#tsparticles),
:deep(#tsparticles canvas) {
  width: 120% !important;
  height: 100% !important;
  pointer-events: none !important;
  filter: drop-shadow(0 0 5px rgba(196, 255, 255, 0.85));
}

:deep(#tsparticles) {
  margin-left: -10%;
}

:deep(#tsparticles canvas) {
  animation: particle-wave-drift 12s ease-in-out infinite alternate;
}

@keyframes particle-wave-drift {
  from {
    transform: translate3d(-3%, 0, 0);
  }

  to {
    transform: translate3d(3%, 0, 0);
  }
}
</style>
