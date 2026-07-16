<template>
  <q-layout view="hHh Lpr lff">
    <q-header reveal :class="$q.dark.isActive ? 'bg-secondary' : 'bg-black'">
      <q-toolbar class="q-px-sm">
        <q-btn
          flat
          @click="drawer = !drawer"
          dense
          icon="menu"
          padding="sm md"
        />
        <q-toolbar-title> agendaih </q-toolbar-title>
        <div class="q-gutter-x-sm">
          <q-btn color="primary" icon="mdi-bell-outline" dense padding="sm" />
          <q-btn color="primary" dense padding="sm">
            <q-avatar v-if="user?.avatarUrl" size="30px">
              <img :src="user?.avatarUrl" alt="Avatar do usuário" />
            </q-avatar>
            <div v-else>
              {{ user?.firstName?.charAt(0) }}{{ user?.lastName?.charAt(0) }}
            </div>
            <q-menu>
              <q-list style="min-width: 200px">
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
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>
    <q-drawer
      v-model="drawer"
      show-if-above
      :mini="miniState"
      @mouseenter="miniState = false"
      @mouseleave="miniState = true"
      :mini-width="70"
      :width="250"
      :breakpoint="500"
      bordered
      :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-1'"
    >
      <q-scroll-area class="fit" :horizontal-thumb-style="{ opacity: '0' }">
        <q-list>
          <q-item clickable v-ripple>
            <q-item-section side>
              <q-icon name="mdi-view-dashboard-outline" />
            </q-item-section>
            <q-item-section> Dashboard </q-item-section>
          </q-item>
          <q-item clickable v-ripple>
            <q-item-section side>
              <q-icon name="mdi-calendar-outline" />
            </q-item-section>
            <q-item-section> Agendamentos </q-item-section>
          </q-item>
          <q-item clickable v-ripple>
            <q-item-section side>
              <q-icon name="mdi-briefcase-outline" />
            </q-item-section>
            <q-item-section> Serviços </q-item-section>
          </q-item>
          <q-item clickable v-ripple>
            <q-item-section side>
              <q-icon name="mdi-account-group-outline" />
            </q-item-section>
            <q-item-section> Clientes </q-item-section>
          </q-item>
          <q-item clickable v-ripple disable>
            <q-item-section side>
              <q-icon name="mdi-bullhorn-outline" />
            </q-item-section>
            <q-item-section> Marketing </q-item-section>
            <q-item-section side>
              <q-icon name="mdi-lock-outline" size="xs"/>
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple disabled>
            <q-item-section side>
              <q-icon name="mdi-finance" />
            </q-item-section>
            <q-item-section> Financeiro </q-item-section>
            <q-item-section side>
              <q-icon name="mdi-lock-outline" size="xs"/>
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple>
            <q-item-section side>
              <q-icon name="mdi-cog-outline" />
            </q-item-section>
            <q-item-section> Configurações </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>
    <q-page-container>
      <slot />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import useAuth from "~/composables/useAuth";
const { logout, user } = useAuth();

const drawer = ref(false);
const miniState = ref(true);

const handleLogout = async () => {
  Loading.show();
  try {
    await logout();
    await navigateTo("/auth/login");
  } finally {
    Loading.hide();
  }
};
</script>

<style scoped lang="sass">

:deep(.q-img__image)
  width: auto !important
</style>
