<template>
  <header class="institutional-header bg-white">
    <q-toolbar class="wrapper q-px-md">
      <q-toolbar-title class="row items-center no-wrap">
        <q-img
          :src="logo"
          alt="AgendaAI"
          fit="contain"
          style="max-width: 132px; max-height: 40px"
        />
      </q-toolbar-title>

      <q-tabs class="gt-sm" no-caps>
        <q-route-tab
          v-for="link in navLinks"
          :key="link.href"
          :label="link.label"
          :to="link.href"
        />
      </q-tabs>

      <q-space class="gt-sm" />

      <q-btn
        label="Acessar plataforma"
        color="primary"
        no-caps
        dense
        padding="sm md"
        unelevated
        :href="adminUrl"
      />
    </q-toolbar>
  </header>
</template>

<script setup lang="ts">
import logo from "~/assets/images/logo.svg";

defineProps<{
  adminUrl: string;
}>();

const navLinks = [
  { label: "Benefícios", href: "#beneficios" },
  { label: "Como funciona", href: "#como-funciona" },
  { label: "Funcionalidades", href: "#funcionalidades" },
  { label: "Planos", href: "#planos" },
  { label: "FAQ", href: "#faq" },
];
</script>

<style scoped>
.institutional-header {
  position: sticky;
  z-index: 100;
  top: 0;
  border-bottom: 1px solid #e5e7eb;
}
</style>
