<template>
  <q-scroll-area :horizontal-thumb-style="{ opacity: '0' }" class="fit">
    <q-item clickable v-ripple to="/" class="gt-sm">
      <q-item-section avatar class="q-mini-drawer-only">
        <q-img
          :src="logotipoUrl"
          fit="contain"
          style="width: 38px; height: 38px"
        />
      </q-item-section>
      <q-item-section class="text-center full-width q-mini-drawer-hide">
        <q-img :src="logoUrl" fit="contain" style="width: 100%; height: 32px" />
      </q-item-section>
    </q-item>
    <q-list class="q-gutter-y-sm q-mt-sm" dense>
      <div v-for="item in menuItems" :key="item.label">
        <q-item-label
          header
          class="text-grey-7 q-py-xs"
          dense
          v-if="item.type === 'header'"
          >{{ item.label }}</q-item-label
        >
        <q-item
          v-if="item.type === 'item'"
          v-ripple="!item.block"
          :clickable="!item.block"
          :to="item.to"
          :disable="item.block"
          :class="{ 'text-grey-6': item.block }"
          class="rounded-borders q-mx-sm"
          style="min-height: 38px"
          active-class="active-item"
        >
          <q-item-section avatar>
            <q-icon :name="item.icon" color="primary" />
          </q-item-section>
          <q-item-section> {{ item.label }} </q-item-section>
          <q-item-section side v-if="item.block">
            <q-chip
              square
              label="PRO"
              color="secondary-light"
              class="text-caption text-secondary text-weight-medium"
            />
          </q-item-section>
        </q-item>
        <q-separator inset v-if="item.type === 'separator' && !miniState" />
      </div>
    </q-list>
    <q-list
      :class="!$q.screen.lt.sm ? 'absolute-bottom' : ''"
      dense
      class="q-gutter-y-sm q-mb-sm"
    >
      <q-separator />
      <q-item-label header class="text-grey-7 q-py-xs" dense
        >Links úteis</q-item-label
      >
      <q-item
        :class="
          miniState && !$q.screen.lt.sm
            ? 'column items-center q-gutter-y-sm'
            : 'row items-center q-gutter-x-xs justify-between'
        "
        class="no-wrap"
      >
        <q-btn
          flat
          icon="mdi-content-copy"
          color="primary"
          padding="sm"
          @click="copyLinkToClipboard"
          dense
          no-caps
        >
          <q-tooltip
            class="text-caption"
            anchor="center right"
            self="center left"
            :offset="[10, 10]"
            >Copiar link</q-tooltip
          >
        </q-btn>
        <q-btn
          flat
          icon="mdi-whatsapp"
          color="primary"
          padding="sm"
          dense
          @click="shareViaWhatsApp"
          no-caps
        >
          <q-tooltip
            class="text-caption"
            anchor="center right"
            self="center left"
            :offset="[10, 10]"
            >Compartilhar link no WhatsApp</q-tooltip
          >
        </q-btn>
        <q-btn
          flat
          icon="mdi-open-in-new"
          color="primary"
          padding="sm"
          dense
          @click="openPage"
          no-caps
        >
          <q-tooltip
            class="text-caption"
            anchor="center right"
            self="center left"
            :offset="[10, 10]"
            >Ir sua página</q-tooltip
          >
        </q-btn>
      </q-item>
      <q-separator inset />
      <q-item
        clickable
        v-ripple
        style="min-height: 50px"
        class="rounded-borders q-mx-sm"
      >
        <q-item-section avatar>
          <q-avatar v-if="user?.avatarUrl" size="40px">
            <img :src="user?.avatarUrl" alt="Avatar do usuário" />
          </q-avatar>
          <q-avatar
            v-else
            color="primary"
            text-color="white"
            font-size="16px"
            size="30px"
          >
            {{ initialLetter }}
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label>
            {{ user?.firstName }} {{ user?.lastName }}
          </q-item-label>
          <q-item-label caption>
            {{ user?.email }}
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-icon name="mdi-chevron-down" />
        </q-item-section>
        <q-menu>
          <q-list>
            <q-item clickable>
              <q-item-section side>
                <q-avatar v-if="user?.avatarUrl" size="40px">
                  <img :src="user?.avatarUrl" alt="Avatar do usuário" />
                </q-avatar>
                <q-avatar
                  v-else
                  color="primary"
                  text-color="white"
                  font-size="20px"
                  size="40px"
                >
                  {{ user?.firstName?.charAt(0)
                  }}{{ user?.lastName?.charAt(0) }}
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label>
                  {{ user?.firstName }} {{ user?.lastName }}
                </q-item-label>
                <q-item-label caption>
                  {{ user?.email }}
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-card flat bordered class="q-ma-sm q-mini-drawer-hide">
              <div class="row items-center justify-between q-pa-sm">
                <div class="col-auto">
                  <q-item-label class="text-weight-medium text-subtitle2"
                    >Uso do plano</q-item-label
                  >
                </div>
                <div class="col-auto">
                  <q-chip
                    square
                    class="text-caption"
                    label="Gratuito"
                    text-color="secondary"
                    color="secondary-light"
                  />
                </div>
              </div>
              <q-list>
                <q-item>
                  <q-item-section avatar>
                    <q-avatar
                      color="primary-light"
                      text-color="primary"
                      icon="mdi-briefcase-outline"
                      rounded
                      size="32px"
                    />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label
                      class="text-weight-medium text-caption row items-center justify-between"
                    >
                      <span>Serviços</span>
                      <span>3/10</span>
                    </q-item-label>
                    <q-linear-progress
                      stripe
                      rounded
                      size="md"
                      :value="servicesProgress"
                      color="primary"
                      class="q-mt-xs"
                    />
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section side>
                    <q-avatar
                      color="primary-light"
                      text-color="primary"
                      icon="mdi-briefcase-outline"
                      rounded
                      size="32px"
                    />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label
                      class="text-weight-medium text-caption row items-center justify-between"
                    >
                      <span>Colaboradores</span>
                      <span>1/1</span>
                    </q-item-label>
                    <q-linear-progress
                      stripe
                      rounded
                      size="md"
                      :value="servicesProgress"
                      color="primary"
                      class="q-mt-xs"
                    />
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section side>
                    <q-avatar
                      color="primary-light"
                      text-color="primary"
                      icon="mdi-briefcase-outline"
                      rounded
                      size="32px"
                    />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label
                      class="text-weight-medium text-caption row items-center justify-between"
                    >
                      <span>Agendamentos no mês</span>
                      <span>3/30</span>
                    </q-item-label>
                    <q-linear-progress
                      stripe
                      rounded
                      size="md"
                      :value="servicesProgress"
                      color="primary"
                      class="q-mt-xs"
                    />
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card>
            <q-item clickable v-close-popup @click="handleLogout">
              <q-item-section side>
                <q-icon name="logout" />
              </q-item-section>
              <q-item-section>Sair</q-item-section>
              <q-item-section side>
                <q-icon name="mdi-chevron-right" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-item>
    </q-list>
  </q-scroll-area>
</template>

<script setup lang="ts">
import useAuth from "~/composables/useAuth";
import logotipoUrl from "~/assets/images/logotipo.svg";
import logoUrl from "~/assets/images/logo.svg";
const { logout, user } = useAuth();
const miniState = defineModel<boolean>("miniState", { required: true });
const servicesProgress = ref(0.5);
const initialLetter = computed(() => {
  return user.value?.firstName?.charAt(0) || user.value?.lastName?.charAt(0);
});

const menuItems = ref<
  {
    icon?: string;
    label?: string;
    to?: string;
    block?: boolean;
    type?: "header" | "item" | "separator";
  }[]
>([
  {
    type: "header",
    label: "Geral",
  },
  {
    icon: "mdi-view-dashboard-outline",
    label: "Dashboard",
    to: "/dashboard",
    block: false,
    type: "item",
  },

  {
    icon: "mdi-calendar-outline",
    label: "Agendamentos",
    to: "/appointments",
    block: false,
    type: "item",
  },
  {
    icon: "mdi-briefcase-outline",
    label: "Serviços",
    to: "/services",
    block: false,
    type: "item",
  },
  {
    icon: "mdi-account-group-outline",
    label: "Clientes",
    to: "/clients",
    block: false,
    type: "item",
  },
  {
    type: "separator",
  },
  {
    type: "header",
    label: "Negocio",
  },
  {
    icon: "mdi-bullhorn-outline",
    label: "Marketing",
    to: "/marketing",
    block: true,
    type: "item",
  },
  {
    icon: "mdi-finance",
    label: "Financeiro",
    to: "/finance",
    block: true,
    type: "item",
  },
  {
    icon: "mdi-account-outline",
    label: "Colaboradores",
    to: "/plans",
    block: true,
    type: "item",
  },
  {
    type: "separator",
  },
  {
    type: "header",
    label: "Sistema",
  },
  {
    icon: "mdi-clipboard-text-outline",
    label: "Planos e Assinaturas",
    to: "/plans",
    block: false,
    type: "item",
  },
  {
    icon: "mdi-cog-outline",
    label: "Configurações",
    to: "/settings",
    block: false,
    type: "item",
  },
]);

const handleLogout = async () => {
  Loading.show();
  try {
    await logout();
    await navigateTo("/auth/login");
  } finally {
    Loading.hide();
  }
};
const url = computed(
  () => `https://${user.value?.business?.slug}.roostec.com.br`,
);
const shareViaWhatsApp = () => {
  const message = `Agende seu horário conosco!\n\nAcesse: ${url.value}`;
  const whatsappUrl = `https://api.whatsapp.com/send/?text=${encodeURIComponent(message)}&type=custom_url&app_absent=0`;
  window.open(whatsappUrl, "_blank");
};
const copyLinkToClipboard = () => {
  navigator.clipboard.writeText(url.value);
  Notify.create({
    message: "Link copiado para a área de transferência",
    color: "primary",
    icon: "mdi-content-copy",
    timeout: 2000,
  });
};
const openPage = () => {
  window.open(url.value, "_blank");
};
</script>

<style scoped lang="sass">

:deep(.q-item__section--avatar)
  min-width: 32px

.active-item
  background-color: $primary-light
  &::before
    content: ''
    position: absolute
    left: 0
    top: 50%
    transform: translateY(-50%)
    width: 3px
    height: 25px
    background-color: $primary
</style>
