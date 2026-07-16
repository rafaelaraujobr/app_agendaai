<template>
  <q-page class="institutional-page">
    <header class="institutional-header">
      <q-toolbar class="wrapper header-toolbar q-px-md">
        <q-toolbar-title class="text-weight-bold"> agendaih </q-toolbar-title>
        <q-space />
        <q-btn
          label="Conheça os recursos"
          href="#recursos"
          flat
          no-caps
          class="gt-xs"
        />
        <q-btn
          label="Acessar plataforma"
          color="primary"
          dense
          padding="sm md"
          no-caps
          unelevated
          :href="adminUrl"
        />
      </q-toolbar>
    </header>

    <main>
      <section class="institutional-hero">
        <div class="wrapper hero-grid q-px-md">
          <div>
            <q-chip
              color="blue-1"
              text-color="primary"
              icon="mdi-sparkles"
              class="q-ml-none q-mb-md"
            >
              Gestão e agendamento em um só lugar
            </q-chip>
            <h1 class="institutional-title q-my-none">
              Sua agenda organizada. Seus clientes mais próximos.
            </h1>
            <p class="institutional-subtitle text-grey-7">
              Tenha uma página personalizada para o seu negócio, receba
              agendamentos online e gerencie sua operação com praticidade.
            </p>
            <div class="row q-gutter-sm q-mt-xl">
              <q-btn
                label="Começar agora"
                icon-right="mdi-arrow-right"
                color="primary"
                dense
                padding="sm md"
                no-caps
                unelevated
                :href="adminUrl"
              />
              <q-btn
                label="Ver como funciona"
                href="#como-funciona"
                color="primary"
                dense
                padding="sm md"
                no-caps
                outline
              />
            </div>
          </div>

          <div class="hero-preview">
            <q-card flat bordered class="preview-card">
              <q-toolbar class="bg-primary text-white">
                <q-toolbar-title class="text-subtitle1 text-weight-bold">
                  Seu logo
                </q-toolbar-title>
                <q-btn icon="mdi-instagram" flat round dense />
                <q-btn icon="mdi-whatsapp" flat round dense />
              </q-toolbar>
              <q-card-section class="q-pa-lg">
                <div class="text-overline text-primary">Próximos horários</div>
                <div class="text-h5 text-weight-bold q-mb-lg">
                  Escolha um serviço
                </div>
                <div class="column q-gutter-md">
                  <div
                    v-for="service in previewServices"
                    :key="service.name"
                    class="preview-service row items-center no-wrap"
                  >
                    <q-avatar
                      :icon="service.icon"
                      color="blue-1"
                      text-color="primary"
                      size="48px"
                    />
                    <div class="col q-ml-md">
                      <div class="text-weight-bold">{{ service.name }}</div>
                      <div class="text-caption text-grey-7">
                        {{ service.duration }}
                      </div>
                    </div>
                    <div class="text-weight-bold">{{ service.price }}</div>
                  </div>
                </div>
                <q-btn
                  label="Agendar horário"
                  icon-right="mdi-calendar-check-outline"
                  color="secondary"
                  no-caps
                  unelevated
                  class="full-width q-mt-lg"
                />
              </q-card-section>
            </q-card>
          </div>
        </div>
      </section>

      <section id="recursos" class="institutional-section bg-white">
        <div class="wrapper q-px-md">
          <div class="section-intro text-center">
            <div class="text-overline text-primary">Recursos</div>
            <h2 class="text-h3 text-weight-bold q-my-sm">
              Tudo para simplificar sua rotina
            </h2>
            <p class="text-body1 text-grey-7">
              Ferramentas integradas para apresentar, organizar e desenvolver o
              seu negócio.
            </p>
          </div>

          <div class="row q-col-gutter-lg">
            <div
              v-for="feature in features"
              :key="feature.title"
              class="col-12 col-sm-6 col-lg-3"
            >
              <q-card flat bordered class="feature-card full-height">
                <q-card-section class="q-pa-lg">
                  <q-avatar
                    :icon="feature.icon"
                    color="blue-1"
                    text-color="primary"
                    size="52px"
                  />
                  <div class="text-h6 text-weight-bold q-mt-lg">
                    {{ feature.title }}
                  </div>
                  <p class="text-body2 text-grey-7 q-mb-none q-mt-sm">
                    {{ feature.description }}
                  </p>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </div>
      </section>

      <section id="como-funciona" class="institutional-section">
        <div class="wrapper q-px-md">
          <div class="section-intro text-center">
            <div class="text-overline text-primary">Como funciona</div>
            <h2 class="text-h3 text-weight-bold q-my-sm">
              Comece em poucos passos
            </h2>
          </div>

          <div class="row q-col-gutter-xl">
            <div
              v-for="(step, index) in steps"
              :key="step.title"
              class="col-12 col-md-4"
            >
              <div class="step-item text-center">
                <q-avatar
                  color="primary"
                  text-color="white"
                  size="56px"
                  class="text-h6 text-weight-bold"
                >
                  {{ index + 1 }}
                </q-avatar>
                <div class="text-h6 text-weight-bold q-mt-lg">
                  {{ step.title }}
                </div>
                <p class="text-body2 text-grey-7">
                  {{ step.description }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="cta-section q-px-md">
        <q-card flat class="wrapper cta-card text-white">
          <q-card-section class="column items-center text-center q-pa-xl">
            <q-icon name="mdi-calendar-check-outline" size="52px" />
            <h2 class="text-h3 text-weight-bold q-my-md">
              Pronto para transformar sua agenda?
            </h2>
            <p class="text-body1 q-mt-none">
              Crie sua conta e disponibilize sua página de agendamentos.
            </p>
            <q-btn
              label="Acessar a plataforma"
              color="white"
              text-color="primary"
              dense
              padding="sm md"
              no-caps
              unelevated
              :href="adminUrl"
              class="q-mt-md"
            />
          </q-card-section>
        </q-card>
      </section>
    </main>

    <footer class="institutional-footer">
      <div class="wrapper q-px-md">
        <q-separator />
        <div class="row items-center justify-between q-py-lg q-gutter-md">
          <!-- <q-img :src="logo" alt="AgendaAI" fit="contain" class="footer-logo" /> -->
          <q-toolbar-title class="text-weight-bold"> agendaih </q-toolbar-title>
          <div class="text-caption text-grey-7">
            © {{ currentYear }} AgendaAI. Todos os direitos reservados.
          </div>
        </div>
      </div>
    </footer>
  </q-page>
</template>

<script setup lang="ts">
// import logo from "~/assets/images/logo.svg";

const config = useRuntimeConfig();
const requestUrl = useRequestURL();
const currentYear = new Date().getFullYear();

const normalizeDomain = (value: unknown) =>
  String(value || "")
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/$/, "");

const adminUrl = computed(() => {
  const port = requestUrl.port ? `:${requestUrl.port}` : "";

  if (
    requestUrl.hostname === "localhost" ||
    requestUrl.hostname.endsWith(".localhost")
  ) {
    return `${requestUrl.protocol}//app.localhost${port}/auth/login`;
  }

  const rootDomain = normalizeDomain(config.public.rootDomain);
  return rootDomain
    ? `${requestUrl.protocol}//app.${rootDomain}/auth/login`
    : "/auth/login";
});

const previewServices = [
  {
    name: "Atendimento personalizado",
    duration: "45 minutos",
    price: "R$ 60",
    icon: "mdi-account-heart-outline",
  },
  {
    name: "Serviço especial",
    duration: "1 hora",
    price: "R$ 90",
    icon: "mdi-star-outline",
  },
];

const features = [
  {
    icon: "mdi-calendar-clock-outline",
    title: "Agenda online",
    description:
      "Organize horários e facilite o agendamento dos seus clientes.",
  },
  {
    icon: "mdi-storefront-outline",
    title: "Página personalizada",
    description:
      "Divulgue serviços, identidade visual, endereço e canais de contato.",
  },
  {
    icon: "mdi-chart-box-outline",
    title: "Gestão centralizada",
    description:
      "Acompanhe sua operação e mantenha as informações sempre atualizadas.",
  },
  {
    icon: "mdi-cellphone-check",
    title: "Experiência responsiva",
    description:
      "Ofereça uma navegação agradável em computadores e dispositivos móveis.",
  },
];

const steps = [
  {
    title: "Crie sua conta",
    description: "Acesse a plataforma e informe os dados básicos do negócio.",
  },
  {
    title: "Personalize sua página",
    description: "Configure marca, endereço, canais, horários e serviços.",
  },
  {
    title: "Compartilhe seu link",
    description:
      "Divulgue seu subdomínio e comece a receber novos agendamentos.",
  },
];
</script>

<style scoped>
.institutional-page {
  background: #f7f9fc;
}

.institutional-header {
  position: sticky;
  z-index: 10;
  top: 0;
  border-bottom: 1px solid #eceff3;
  background: rgb(255 255 255 / 94%);
  backdrop-filter: blur(12px);
}

.header-toolbar {
  min-height: 72px;
  gap: 8px;
}

.institutional-logo {
  width: 142px;
  height: 42px;
}

.institutional-logo :deep(.q-img__image),
.footer-logo :deep(.q-img__image) {
  width: auto;
}

.institutional-hero {
  overflow: hidden;
  background:
    radial-gradient(circle at 85% 20%, rgb(25 118 210 / 14%), transparent 34%),
    radial-gradient(circle at 15% 80%, rgb(38 166 154 / 10%), transparent 28%);
}

.hero-grid {
  display: grid;
  min-height: 680px;
  grid-template-columns: minmax(0, 1.05fr) minmax(360px, 0.8fr);
  align-items: center;
  gap: 72px;
  padding-block: 72px;
}

.institutional-title {
  max-width: 760px;
  color: #172033;
  font-size: clamp(2.7rem, 5vw, 4.8rem);
  font-weight: 700;
  line-height: 1.05;
}

.institutional-subtitle {
  max-width: 660px;
  margin-top: 24px;
  font-size: 1.2rem;
  line-height: 1.7;
}

.hero-preview {
  position: relative;
}

.hero-preview::before {
  position: absolute;
  inset: 8% -12%;
  border-radius: 50%;
  background: rgb(25 118 210 / 10%);
  content: "";
  filter: blur(4px);
}

.preview-card {
  position: relative;
  overflow: hidden;
  border-color: #dfe5ed;
  border-radius: 18px;
  box-shadow: 0 24px 70px rgb(30 55 90 / 16%);
}

.preview-service {
  border: 1px solid #eceff3;
  border-radius: 12px;
  padding: 12px;
}

.institutional-section {
  padding-block: 88px;
}

.section-intro {
  max-width: 720px;
  margin: 0 auto 48px;
}

.feature-card {
  border-color: #e3e7ed;
  border-radius: 14px;
  transition:
    transform 180ms ease,
    box-shadow 180ms ease;
}

.feature-card:hover {
  box-shadow: 0 14px 36px rgb(30 55 90 / 10%);
  transform: translateY(-4px);
}

.step-item {
  max-width: 340px;
  margin-inline: auto;
}

.cta-section {
  padding-block: 24px 88px;
}

.cta-card {
  border-radius: 20px;
  background: linear-gradient(135deg, #1976d2, #135aa4);
}

.institutional-footer {
  background: #fff;
}

.footer-logo {
  width: 120px;
  height: 36px;
}

@media (max-width: 900px) {
  .hero-grid {
    min-height: auto;
    grid-template-columns: 1fr;
    gap: 48px;
  }

  .hero-preview {
    width: min(100%, 560px);
    margin-inline: auto;
  }
}

@media (max-width: 599px) {
  .header-toolbar {
    min-height: 64px;
  }

  .institutional-logo {
    width: 112px;
    height: 36px;
  }

  .hero-grid {
    gap: 40px;
    padding-block: 48px;
  }

  .institutional-title {
    font-size: 2.55rem;
  }

  .institutional-subtitle {
    font-size: 1.05rem;
  }

  .institutional-hero .q-btn {
    width: 100%;
  }

  .institutional-section {
    padding-block: 64px;
  }

  .section-intro .text-h3,
  .cta-card .text-h3 {
    font-size: 2rem;
  }
}
</style>
