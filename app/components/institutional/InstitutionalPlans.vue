<template>
  <section id="planos" class="q-py-xl bg-grey-1">
    <div class="wrapper q-px-md">
      <div class="text-center q-mb-xl">
        <div class="text-overline text-primary">Planos</div>
        <h2 class="text-h4 text-weight-bold q-my-sm">
          Escolha o plano ideal para você
        </h2>
        <p class="text-body1 text-grey-7 q-mb-none">
          Comece grátis e evolua quando precisar de mais recursos.
        </p>
      </div>

      <div class="row q-col-gutter-lg items-stretch justify-center">
        <div
          v-for="plan in plans"
          :key="plan.name"
          class="col-12 col-md-4"
        >
          <InstitutionalPlanCard v-bind="plan" :admin-url="adminUrl" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import InstitutionalPlanCard from "./InstitutionalPlanCard.vue";

defineProps<{
  adminUrl: string;
}>();

const plans = [
  {
    name: "FREE",
    description: "Para começar a organizar sua agenda online.",
    price: "R$ 0",
    priceSuffix: "",
    features: [
      "Página pública de agendamento",
      "Cadastro básico de serviços",
      "Agenda simples",
      "Compartilhamento do link",
      "Até 1 profissional",
    ],
    limitations: [
      "Recursos limitados",
      "Sem personalização avançada",
      "Sem relatórios",
    ],
    recommended: false,
    buttonLabel: "Começar grátis",
  },
  {
    name: "PRO",
    description: "Para profissionais que querem mais controle da agenda.",
    price: "R$ 29,90",
    priceSuffix: "/mês",
    features: [
      "Tudo do plano FREE",
      "Serviços ilimitados",
      "Mais opções de personalização",
      "Controle de clientes",
      "Bloqueio de horários",
      "Indicadores básicos",
      "Mensagens prontas para WhatsApp",
    ],
    limitations: ["Não inclui recursos avançados de equipe"],
    recommended: true,
    buttonLabel: "Assinar PRO",
  },
  {
    name: "PREMIUM",
    description: "Para negócios com equipe ou operação mais completa.",
    price: "R$ 59,90",
    priceSuffix: "/mês",
    features: [
      "Tudo do plano PRO",
      "Múltiplos profissionais",
      "Relatórios avançados",
      "Controle por colaborador",
      "Recursos avançados de agenda",
      "Prioridade em novas funcionalidades",
    ],
    limitations: undefined,
    recommended: false,
    buttonLabel: "Conhecer PREMIUM",
  },
];
</script>
