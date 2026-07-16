<template>
  <InstitutionalHome v-if="accessContext === 'institutional'" />

  <q-page v-else class="showcase-page">
    <q-inner-loading
      :showing="status === 'pending'"
      label="Carregando informações da loja..."
      label-class="text-primary"
      color="primary"
    />

    <div
      v-if="status !== 'pending' && !business"
      class="empty-state column items-center justify-center text-center q-pa-lg"
    >
      <q-icon
        :name="
          isBusinessNotFound
            ? 'mdi-store-search-outline'
            : 'mdi-alert-circle-outline'
        "
        color="grey-6"
        size="80px"
      />
      <h1 class="text-h5 text-weight-bold q-mb-sm">
        {{
          isBusinessNotFound
            ? "Loja não encontrada"
            : "Não foi possível carregar a loja"
        }}
      </h1>
      <p class="text-body1 text-grey-7 q-mt-none">
        {{
          isBusinessNotFound
            ? "Não encontramos uma loja cadastrada neste endereço."
            : "Ocorreu um erro ao carregar as informações. Tente novamente."
        }}
      </p>
      <q-btn
        label="Tentar novamente"
        icon="mdi-refresh"
        color="primary"
        no-caps
        unelevated
        @click="() => refresh()"
      />
    </div>

    <template v-else-if="business">
      <!-- <section
        class="hero-section text-white"
        :style="{
          background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
        }"
      >
        <q-img
          v-if="business.bannerUrl"
          :src="business.bannerUrl"
          :alt="`Capa de ${business.name}`"
          fit="cover"
          class="hero-banner absolute-full"
        />
        <div v-if="business.bannerUrl" class="hero-overlay absolute-full" />

        <div class="wrapper hero-content relative-position q-px-md">
          <q-chip
            v-if="business.businessType"
            color="white"
            text-color="grey-9"
            icon="mdi-storefront-outline"
            class="q-ml-none q-mb-md"
          >
            {{ business.businessType.name }}
          </q-chip>
          <h1 class="hero-title q-my-none">{{ business.name }}</h1>
          <p v-if="business.description" class="hero-description q-mb-none">
            {{ business.description }}
          </p>

          <div class="hero-actions row q-gutter-sm q-mt-lg">
            <q-btn
              v-if="business.services.length"
              label="Ver serviços"
              icon="mdi-calendar-check-outline"
              color="white"
              text-color="grey-9"
              no-caps
              unelevated
              href="#servicos"
            />
            <q-btn
              v-if="whatsappUrl"
              label="Falar no WhatsApp"
              icon="mdi-whatsapp"
              color="white"
              text-color="green-8"
              no-caps
              outline
              :href="whatsappUrl"
              target="_blank"
              rel="noopener noreferrer"
            />
          </div>
        </div>
      </section> -->

      <main class="wrapper showcase-content q-px-md">
        <section
          v-if="business.services.length"
          id="servicos"
          class="showcase-section"
        >
          <div class="section-heading">
            <div>
              <div class="text-overline" :style="{ color: primaryColor }">
                Serviços
              </div>
              <h2 class="text-h4 text-weight-bold q-my-none">
                Escolha o melhor para você
              </h2>
            </div>
            <div class="text-body1 text-grey-7">
              Conheça os serviços disponíveis e agende seu horário.
            </div>
          </div>

          <div class="row q-col-gutter-lg">
            <div
              v-for="service in business.services"
              :key="service.id"
              class="col-12 col-sm-6 col-lg-4"
            >
              <q-card flat bordered class="service-card column full-height">
                <q-img
                  v-if="getServiceImage(service)"
                  :src="getServiceImage(service)!"
                  :alt="service.name"
                  ratio="1.6"
                  fit="cover"
                />
                <div
                  v-else
                  class="service-image-placeholder column items-center justify-center"
                  :style="{ color: primaryColor }"
                >
                  <q-icon name="mdi-content-cut" size="56px" />
                </div>

                <q-card-section class="col">
                  <div class="text-h6 text-weight-bold">{{ service.name }}</div>
                  <div
                    class="row items-center q-gutter-x-sm text-grey-7 q-mt-xs"
                  >
                    <q-icon name="mdi-clock-outline" />
                    <span>{{ formatDuration(service.durationMinutes) }}</span>
                  </div>
                  <p
                    v-if="service.description"
                    class="service-description text-body2 text-grey-7 q-mb-none"
                  >
                    {{ service.description }}
                  </p>
                </q-card-section>

                <q-separator />
                <q-card-actions class="items-center q-pa-md">
                  <div class="text-h6 text-weight-bold">
                    {{ formatCurrency(service.price) }}
                  </div>
                  <q-space />
                  <q-btn
                    v-if="getServiceWhatsappUrl(service.name)"
                    label="Agendar"
                    icon-right="mdi-arrow-right"
                    text-color="white"
                    no-caps
                    unelevated
                    :style="{ backgroundColor: secondaryColor }"
                    :href="getServiceWhatsappUrl(service.name) || undefined"
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                </q-card-actions>
              </q-card>
            </div>
          </div>
        </section>

        <section class="showcase-section">
          <div class="row q-col-gutter-lg items-stretch">
            <div v-if="business.businessAddress" class="col-12 col-lg-7">
              <q-card
                flat
                bordered
                class="info-card full-height overflow-hidden"
              >
                <q-card-section class="q-pa-lg">
                  <div class="row items-start no-wrap q-gutter-md">
                    <q-avatar
                      icon="mdi-map-marker-outline"
                      text-color="white"
                      :style="{ backgroundColor: primaryColor }"
                    />
                    <div class="col">
                      <div class="text-h6 text-weight-bold">Onde estamos</div>
                      <div class="text-body2 text-grey-7">
                        {{ formattedAddress }}
                      </div>
                    </div>
                    <q-btn
                      icon="mdi-open-in-new"
                      aria-label="Abrir endereço no mapa"
                      flat
                      round
                      color="primary"
                      :href="mapsUrl"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <q-tooltip>Abrir no mapa</q-tooltip>
                    </q-btn>
                  </div>
                </q-card-section>

                <q-separator />

                <ClientOnly v-if="hasCoordinates">
                  <div class="showcase-map">
                    <LMap
                      :zoom="16"
                      :center="mapCenter"
                      :use-global-leaflet="false"
                      :options="{ scrollWheelZoom: false }"
                    >
                      <LTileLayer
                        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                        attribution="&copy; OpenStreetMap contributors &copy; CARTO"
                        layer-type="base"
                        name="CARTO Positron"
                      />
                      <LMarker :lat-lng="mapCenter">
                        <LTooltip
                          :options="{
                            permanent: true,
                            direction: 'top',
                            offset: [0, -28],
                            opacity: 1,
                          }"
                        >
                          {{ business.name }}
                        </LTooltip>
                      </LMarker>
                    </LMap>
                  </div>
                  <template #fallback>
                    <q-skeleton height="340px" square />
                  </template>
                </ClientOnly>

                <q-banner v-else class="bg-grey-1 text-grey-8">
                  <template #avatar>
                    <q-icon name="mdi-map-marker-alert-outline" />
                  </template>
                  A localização no mapa ainda não está disponível.
                </q-banner>
              </q-card>
            </div>

            <div
              v-if="business.businessWorkingHours.length"
              class="col-12"
              :class="business.businessAddress ? 'col-lg-5' : ''"
            >
              <q-card flat bordered class="info-card full-height">
                <q-card-section class="q-pa-lg">
                  <div class="row items-center no-wrap q-gutter-md">
                    <q-avatar
                      icon="mdi-clock-outline"
                      text-color="white"
                      :style="{ backgroundColor: primaryColor }"
                    />
                    <div>
                      <div class="text-h6 text-weight-bold">
                        Horário de atendimento
                      </div>
                      <div class="text-body2 text-grey-7">
                        Confira nossos horários
                      </div>
                    </div>
                  </div>
                </q-card-section>

                <q-separator />
                <q-list separator>
                  <q-item
                    v-for="workingHour in sortedWorkingHours"
                    :key="workingHour.dayOfWeek"
                    class="q-px-lg"
                  >
                    <q-item-section>
                      <q-item-label>
                        {{ dayLabels[workingHour.dayOfWeek] }}
                      </q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-item-label
                        :class="
                          workingHour.isActive ? 'text-grey-9' : 'text-negative'
                        "
                      >
                        {{ formatWorkingHour(workingHour) }}
                      </q-item-label>
                      <q-item-label v-if="formatBreak(workingHour)" caption>
                        Intervalo: {{ formatBreak(workingHour) }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card>
            </div>
          </div>
        </section>

        <section
          v-if="business.businessChannels.length"
          class="showcase-section q-pt-none"
        >
          <q-card flat bordered class="contact-card">
            <q-card-section class="q-pa-lg">
              <div class="row items-center q-col-gutter-lg">
                <div class="col-12 col-md">
                  <div class="text-h6 text-weight-bold">Entre em contato</div>
                  <div class="text-body2 text-grey-7">
                    Acompanhe nossos canais e fale com nossa equipe.
                  </div>
                </div>
                <div class="col-12 col-md-auto">
                  <div class="row q-col-gutter-sm">
                    <div
                      v-for="channel in business.businessChannels"
                      :key="channel.type"
                      class="col-12 col-sm-auto"
                    >
                      <q-btn
                        class="full-width"
                        :icon="channelIcons[channel.type]"
                        :label="channelLabels[channel.type]"
                        outline
                        no-caps
                        :style="{ color: primaryColor }"
                        :href="getChannelUrl(channel.type, channel.channel)"
                        target="_blank"
                        rel="noopener noreferrer"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </section>
      </main>
    </template>
  </q-page>
</template>

<script setup lang="ts">
import InstitutionalHome from "~/components/institutional/InstitutionalHome.vue";
import type {
  PublicBusiness,
  PublicBusinessChannelType,
  PublicBusinessResponse,
} from "~/types/public-business";

definePageMeta({
  layout: "showcase",
  middleware: () => {
    const currentAccessContext = useState<
      "institutional" | "admin" | "showcase"
    >("access-context", () => "institutional");
    if (currentAccessContext.value !== "admin") return;

    const { loggedIn } = useUserSession();
    return navigateTo(loggedIn.value ? "/dashboard" : "/auth/login", {
      replace: true,
    });
  },
});

const accessContext = useState<"institutional" | "admin" | "showcase">(
  "access-context",
  () => "institutional",
);
const subdomain = useState<string | null>("subdomain", () => null);
const showcaseBusiness = useState<PublicBusiness | null>(
  "showcase-business",
  () => null,
);

const { data, error, status, refresh } =
  await useAsyncData<PublicBusinessResponse | null>(
    "public-business",
    async () => {
      if (accessContext.value !== "showcase" || !subdomain.value) return null;

      return await $fetch<PublicBusinessResponse>("/api/businesses", {
        query: { slug: subdomain.value },
      });
    },
    {
      watch: [accessContext, subdomain],
    },
  );

const business = computed(() => data.value?.business ?? null);
const isBusinessNotFound = computed(() => {
  const requestError = error.value as { statusCode?: number } | null;
  return requestError?.statusCode === 404;
});
const primaryColor = computed(
  () => business.value?.businessLayout?.primaryColor || "#1976d2",
);
const secondaryColor = computed(
  () => business.value?.businessLayout?.secondaryColor || "#26a69a",
);

let stopWatchingBusiness: (() => void) | undefined;

onMounted(() => {
  showcaseBusiness.value = business.value;
  stopWatchingBusiness = watch(business, (value) => {
    showcaseBusiness.value = value;
  });
});

onBeforeUnmount(() => {
  stopWatchingBusiness?.();
  showcaseBusiness.value = null;
});

useSeoMeta({
  title: () =>
    accessContext.value === "institutional"
      ? "AgendaAI | Gestão e agendamento online"
      : business.value
      ? `${business.value.name} | Agendamento online`
      : "Loja não encontrada",
  description: () =>
    accessContext.value === "institutional"
      ? "Crie uma página personalizada, receba agendamentos online e gerencie seu negócio em um só lugar."
      : business.value?.description ||
        (business.value
          ? `Conheça os serviços e agende seu horário com ${business.value.name}.`
          : "Página pública para agendamento online."),
  ogTitle: () =>
    accessContext.value === "institutional"
      ? "AgendaAI"
      : business.value?.name || "Agendamento online",
  ogDescription: () =>
    accessContext.value === "institutional"
      ? "Gestão e agendamento online para o seu negócio."
      : business.value?.description || "",
  ogImage: () =>
    business.value?.bannerUrl || business.value?.logoUrl || undefined,
});

const dayLabels: Record<
  PublicBusiness["businessWorkingHours"][number]["dayOfWeek"],
  string
> = {
  MONDAY: "Segunda-feira",
  TUESDAY: "Terça-feira",
  WEDNESDAY: "Quarta-feira",
  THURSDAY: "Quinta-feira",
  FRIDAY: "Sexta-feira",
  SATURDAY: "Sábado",
  SUNDAY: "Domingo",
};

const dayOrder = Object.keys(dayLabels) as Array<keyof typeof dayLabels>;

const channelIcons: Record<PublicBusinessChannelType, string> = {
  WHATSAPP: "mdi-whatsapp",
  TELEGRAM: "mdi-send",
  INSTAGRAM: "mdi-instagram",
  FACEBOOK: "mdi-facebook",
};

const channelLabels: Record<PublicBusinessChannelType, string> = {
  WHATSAPP: "WhatsApp",
  TELEGRAM: "Telegram",
  INSTAGRAM: "Instagram",
  FACEBOOK: "Facebook",
};

const sortedWorkingHours = computed(() =>
  [...(business.value?.businessWorkingHours || [])].sort(
    (first, second) =>
      dayOrder.indexOf(first.dayOfWeek) - dayOrder.indexOf(second.dayOfWeek),
  ),
);

const hasCoordinates = computed(() => {
  const address = business.value?.businessAddress;
  return Boolean(
    address &&
    address.latitude !== null &&
    address.longitude !== null &&
    address.latitude !== 0 &&
    address.longitude !== 0,
  );
});

const mapCenter = computed<[number, number]>(() => [
  business.value?.businessAddress?.latitude || -14.235,
  business.value?.businessAddress?.longitude || -51.9253,
]);

const formattedAddress = computed(() => {
  const address = business.value?.businessAddress;
  if (!address) return "";

  const street = [address.address, address.number].filter(Boolean).join(", ");
  const district = address.neighborhood || "";
  const city = [address.city, address.state].filter(Boolean).join(" - ");
  return [street, district, city, address.zip].filter(Boolean).join(" · ");
});

const mapsUrl = computed(() => {
  const query = hasCoordinates.value
    ? mapCenter.value.join(",")
    : formattedAddress.value;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
});

const minutesToTime = (minutes: number) => {
  const hours = Math.floor(minutes / 60)
    .toString()
    .padStart(2, "0");
  const remainingMinutes = (minutes % 60).toString().padStart(2, "0");
  return `${hours}:${remainingMinutes}`;
};

const formatWorkingHour = (
  workingHour: PublicBusiness["businessWorkingHours"][number],
) => {
  if (!workingHour.isActive) return "Fechado";
  return `${minutesToTime(workingHour.startMinutes)} às ${minutesToTime(
    workingHour.endMinutes,
  )}`;
};

const formatBreak = (
  workingHour: PublicBusiness["businessWorkingHours"][number],
) => {
  if (
    !workingHour.isActive ||
    workingHour.breakStartMinutes === null ||
    workingHour.breakEndMinutes === null
  ) {
    return "";
  }

  return `${minutesToTime(workingHour.breakStartMinutes)} às ${minutesToTime(
    workingHour.breakEndMinutes,
  )}`;
};

const formatCurrency = (price: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);

const formatDuration = (minutes: number) => {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes ? `${hours}h ${remainingMinutes}min` : `${hours}h`;
};

const getServiceImage = (service: PublicBusiness["services"][number]) =>
  service.imageUrl || service.illustration?.imageUrl || null;

const getHandle = (value: string) =>
  value
    .trim()
    .replace(
      /^https?:\/\/(?:www\.)?(?:instagram\.com|facebook\.com|t\.me)\//i,
      "",
    )
    .replace(/^@/, "")
    .split(/[/?#]/)[0];

const getChannelUrl = (type: PublicBusinessChannelType, value: string) => {
  if (type === "WHATSAPP") {
    return `https://wa.me/${value.replace(/\D/g, "")}`;
  }

  const handle = getHandle(value);
  if (type === "TELEGRAM") return `https://t.me/${handle}`;
  if (type === "INSTAGRAM") return `https://instagram.com/${handle}`;
  return `https://facebook.com/${handle}`;
};

const whatsappNumber = computed(() => {
  const channel = business.value?.businessChannels.find(
    (item) => item.type === "WHATSAPP",
  );
  return (channel?.channel || business.value?.phone || "").replace(/\D/g, "");
});

const getWhatsappUrl = (message: string) => {
  if (!whatsappNumber.value) return null;
  return `https://wa.me/${whatsappNumber.value}?text=${encodeURIComponent(message)}`;
};

const whatsappUrl = computed(() =>
  business.value
    ? getWhatsappUrl(
        `Olá! Gostaria de mais informações sobre ${business.value.name}.`,
      )
    : null,
);

const getServiceWhatsappUrl = (serviceName: string) =>
  business.value
    ? getWhatsappUrl(
        `Olá! Gostaria de agendar o serviço "${serviceName}" em ${business.value.name}.`,
      )
    : null;
</script>

<style scoped>
.showcase-page {
  min-height: calc(100vh - 72px);
}

.empty-state {
  min-height: 70vh;
}

.hero-section {
  position: relative;
  min-height: 440px;
  overflow: hidden;
}

.hero-banner {
  z-index: 0;
}

.hero-overlay {
  z-index: 1;
  background: linear-gradient(
    90deg,
    rgb(0 0 0 / 72%) 0%,
    rgb(0 0 0 / 48%) 55%,
    rgb(0 0 0 / 18%) 100%
  );
}

.hero-content {
  z-index: 2;
  display: flex;
  min-height: 440px;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding-block: 72px;
}

.hero-title {
  max-width: 760px;
  font-size: clamp(2.4rem, 6vw, 4.5rem);
  font-weight: 700;
  line-height: 1.05;
}

.hero-description {
  max-width: 680px;
  margin-top: 20px;
  font-size: 1.1rem;
  line-height: 1.7;
  white-space: pre-line;
}

.showcase-content {
  padding-block: 24px 64px;
}

.showcase-section {
  padding-top: 56px;
}

.section-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 28px;
}

.section-heading > :last-child {
  max-width: 440px;
}

.service-card,
.info-card,
.contact-card {
  border-color: #e0e0e0;
  border-radius: 14px;
  background: #fff;
}

.service-card {
  overflow: hidden;
  transition:
    transform 180ms ease,
    box-shadow 180ms ease;
}

.service-card:hover {
  box-shadow: 0 12px 32px rgb(0 0 0 / 9%);
  transform: translateY(-4px);
}

.service-image-placeholder {
  min-height: 210px;
  background: #f5f5f5;
}

.service-description {
  display: -webkit-box;
  margin-top: 14px;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  line-clamp: 3;
}

.showcase-map {
  height: 340px;
}

@media (max-width: 767px) {
  .hero-section,
  .hero-content {
    min-height: 380px;
  }

  .hero-content {
    padding-block: 56px;
  }

  .hero-actions {
    width: 100%;
  }

  .hero-actions :deep(.q-btn) {
    width: 100%;
  }

  .section-heading {
    display: block;
  }

  .section-heading > :last-child {
    margin-top: 12px;
  }

  .showcase-section {
    padding-top: 40px;
  }
}
</style>
