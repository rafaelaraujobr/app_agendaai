<template>
  <section id="faq" class="q-py-xl bg-white">
    <div class="wrapper q-px-md">
      <div class="text-center q-mb-xl">
        <div class="text-overline text-primary">Perguntas frequentes</div>
        <h2 class="text-h4 text-weight-bold q-my-sm">Tire suas dúvidas</h2>
      </div>

      <q-list bordered separator class="rounded-borders">
        <q-expansion-item
          v-for="item in faqItems"
          :key="item.question"
          expand-separator
          :label="item.question"
          header-class="text-weight-medium"
        >
          <q-card flat class="bg-grey-1">
            <q-card-section class="text-body2 text-grey-8">
              {{ item.answer }}
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </q-list>
    </div>
  </section>
</template>

<script setup lang="ts">
const faqItems = [
  {
    question: "Preciso instalar aplicativo?",
    answer:
      "Não. O sistema funciona pelo navegador e pode ser salvo na tela inicial do celular.",
  },
  {
    question: "Meus clientes precisam criar conta?",
    answer:
      "Não. O cliente acessa o link, escolhe o serviço, data e horário, informa os dados básicos e envia o pedido.",
  },
  {
    question: "Posso compartilhar no WhatsApp e Instagram?",
    answer:
      "Sim. A ideia é justamente facilitar o compartilhamento do seu link onde seus clientes já estão.",
  },
  {
    question: "Consigo usar no celular?",
    answer:
      "Sim. A interface é pensada primeiro para celular, funcionando bem em telas menores.",
  },
  {
    question: "O plano grátis tem limite?",
    answer:
      "Sim. O plano grátis serve para começar, com recursos básicos. Para mais controle e personalização, existe o plano PRO.",
  },
  {
    question: "Posso mudar de plano depois?",
    answer:
      "Sim. Você pode começar no FREE e evoluir para PRO ou PREMIUM quando precisar.",
  },
];
</script>
