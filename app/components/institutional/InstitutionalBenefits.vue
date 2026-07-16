<template>
  <section id="beneficios" class="q-py-xl bg-white">
    <div class="wrapper q-px-md">
      <div class="text-center q-mb-xl">
        <div class="text-overline text-primary">Benefícios</div>
        <h2 class="text-h4 text-weight-bold q-my-sm">
          Tudo que você precisa no dia a dia
        </h2>
        <p class="text-body1 text-grey-7 q-mb-none">
          Feito para profissionais que trabalham com horário marcado e precisam
          de praticidade.
        </p>
      </div>

      <div class="row q-col-gutter-lg">
        <div
          v-for="benefit in benefits"
          :key="benefit.title"
          class="col-12 col-sm-6 col-lg-3"
        >
          <q-card flat bordered class="full-height rounded-borders">
            <q-card-section class="q-pa-lg">
              <q-avatar
                :icon="benefit.icon"
                color="blue-1"
                text-color="primary"
                size="52px"
              />
              <div class="text-h6 text-weight-bold q-mt-md">
                {{ benefit.title }}
              </div>
              <p class="text-body2 text-grey-7 q-mb-none q-mt-sm">
                {{ benefit.description }}
              </p>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const benefits = [
  {
    icon: "mdi-message-off-outline",
    title: "Menos mensagens repetidas",
    description:
      "Seus clientes consultam serviços, valores e horários disponíveis sem precisar perguntar tudo no WhatsApp.",
  },
  {
    icon: "mdi-calendar-check-outline",
    title: "Agenda sempre organizada",
    description:
      "Veja seus atendimentos do dia, horários livres, pedidos pendentes e próximos clientes.",
  },
  {
    icon: "mdi-link-variant",
    title: "Link para divulgar",
    description:
      "Compartilhe sua página no Instagram, WhatsApp ou onde seus clientes já estão.",
  },
  {
    icon: "mdi-cellphone",
    title: "Feito para celular",
    description:
      "Interface simples, rápida e pensada para profissionais que trabalham direto pelo smartphone.",
  },
];
</script>
