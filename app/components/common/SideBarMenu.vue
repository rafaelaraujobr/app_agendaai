<template>
  <q-scroll-area :horizontal-thumb-style="{ opacity: '0' }" class="fit">
    <q-list class="q-gutter-y-sm q-mt-sm">
      <q-item clickable v-ripple to="/" class="gt-sm">
        <q-item-section
          v-if="miniState"
          avatar
          class="text-primary text-weight-bold text-h6"
        >
          AG
        </q-item-section>
        <q-item-section class="text-weight-bold text-h6">
          agendaih
        </q-item-section>
      </q-item>
      <q-item
        v-for="item in menuItems"
        :key="item.label"
        v-ripple="!item.block"
        :clickable="!item.block"
        :to="item.to"
        :disable="item.block"
        :class="{ 'text-grey-6': item.block }"
        class="rounded-borders q-mx-sm"
        active-class="bg-primary text-white"
      >
        <q-item-section avatar>
          <q-icon :name="item.icon" />
        </q-item-section>
        <q-item-section> {{ item.label }} </q-item-section>
        <q-item-section avatar v-if="item.block">
          <q-icon name="mdi-lock-outline" size="xs" />
        </q-item-section>
      </q-item>
    </q-list>
    <q-list :class="!$q.screen.lt.sm ? 'absolute-bottom' : ''">
      <q-separator />
      <q-item clickable v-ripple @click="shareViaWhatsApp">
        <q-item-section side>
          <q-icon name="mdi-whatsapp" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Compartilhar</q-item-label>
        </q-item-section>
      </q-item>
      <q-item clickable v-ripple @click="copyLinkToClipboard">
        <q-item-section side>
          <q-icon name="mdi-content-copy" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Link de acesso</q-item-label>
        </q-item-section>
      </q-item>
      <q-separator />
      <q-item clickable v-ripple>
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
            <q-item clickable v-close-popup @click="handleLogout">
              <q-item-section side>
                <q-icon name="logout" />
              </q-item-section>
              <q-item-section>Sair</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-item>
    </q-list>
  </q-scroll-area>
</template>

<script setup lang="ts">
import useAuth from "~/composables/useAuth";
const { logout, user } = useAuth();
const miniState = defineModel<boolean>("miniState", { required: true });

const initialLetter = computed(() => {
  return user.value?.firstName?.charAt(0) || user.value?.lastName?.charAt(0);
});

const menuItems = ref<
  {
    icon: string;
    label: string;
    to: string;
    block: boolean;
  }[]
>([
  {
    icon: "mdi-view-dashboard-outline",
    label: "Dashboard",
    to: "/dashboard",
    block: false,
  },

  {
    icon: "mdi-calendar-outline",
    label: "Agendamentos",
    to: "/appointments",
    block: false,
  },
  {
    icon: "mdi-briefcase-outline",
    label: "Serviços",
    to: "/services",
    block: false,
  },
  {
    icon: "mdi-account-group-outline",
    label: "Clientes",
    to: "/clients",
    block: false,
  },
  {
    icon: "mdi-bullhorn-outline",
    label: "Marketing",
    to: "/marketing",
    block: true,
  },
  {
    icon: "mdi-finance",
    label: "Financeiro",
    to: "/finance",
    block: true,
  },
  {
    icon: "mdi-account-outline",
    label: "Planos e Assinaturas",
    to: "/plans",
    block: false,
  },
  {
    icon: "mdi-cog-outline",
    label: "Configurações",
    to: "/settings",
    block: false,
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
</script>

<style scoped lang="sass">

:deep(.q-item__section--avatar)
  min-width: 32px
</style>
