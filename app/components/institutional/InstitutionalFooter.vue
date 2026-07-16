<template>
  <footer class="bg-white q-pt-lg">
    <div class="wrapper q-px-md">
      <div class="row q-col-gutter-xl q-pb-lg">
        <div class="col-12 col-md-5">
          <q-img
            :src="logo"
            alt="AgendaAI"
            fit="contain"
            style="max-width: 132px; max-height: 40px"
            class="q-mb-md"
          />
          <p class="text-body2 text-grey-7 q-mb-none">
            Plataforma de agendamento online para profissionais autônomos e
            pequenos estabelecimentos que querem organizar horários e receber
            mais clientes.
          </p>
        </div>

        <div class="col-12 col-sm-6 col-md-4">
          <div class="text-subtitle2 text-weight-bold q-mb-md">Links rápidos</div>
          <q-list dense>
            <q-item
              v-for="link in quickLinks"
              :key="link.href"
              :href="link.href"
              clickable
              tag="a"
              class="q-px-none"
            >
              <q-item-section>
                <q-item-label class="text-grey-7">{{ link.label }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </div>

        <div class="col-12 col-sm-6 col-md-3">
          <div class="text-subtitle2 text-weight-bold q-mb-md">Plataforma</div>
          <q-btn
            label="Acessar plataforma"
            icon-right="mdi-arrow-right"
            color="primary"
            no-caps
            unelevated
            class="full-width"
            :href="adminUrl"
          />
        </div>
      </div>

      <q-separator />

      <div class="row items-center justify-between q-py-md text-caption text-grey-7">
        <div>© {{ currentYear }} AgendaAI. Todos os direitos reservados.</div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import logo from "~/assets/images/logo.svg";

defineProps<{
  adminUrl: string;
}>();

const currentYear = new Date().getFullYear();

const quickLinks = [
  { label: "Benefícios", href: "#beneficios" },
  { label: "Como funciona", href: "#como-funciona" },
  { label: "Funcionalidades", href: "#funcionalidades" },
  { label: "Planos", href: "#planos" },
  { label: "Perguntas frequentes", href: "#faq" },
];
</script>
