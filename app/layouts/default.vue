<template>
  <q-layout view="hHh Lpr lff">
    <q-header reveal :class="$q.dark.isActive ? 'bg-secondary' : 'bg-black'">
      <q-toolbar>
        <q-btn flat @click="drawer = !drawer" round dense icon="menu" />
        <q-toolbar-title>logo do sistema</q-toolbar-title>
        <q-item clickable v-ripple>
          <q-item-section>
            <q-avatar v-if="user?.avatarUrl" size="30px">
              <img :src="user?.avatarUrl" alt="Avatar do usuário" />
            </q-avatar>
            <q-avatar
              v-else
              color="primary"
              text-color="white"
              icon="person"
              size="35px"
              font-size="25px"
            />
          </q-item-section>
          <q-menu>
            <q-list style="min-width: 200px">
              <q-item clickable>
                <q-item-section side>
                  <q-avatar v-if="user?.avatarUrl" size="30px">
                    <img :src="user?.avatarUrl" alt="Avatar do usuário" />
                  </q-avatar>
                  <q-avatar
                    v-else
                    color="primary"
                    text-color="white"
                    icon="person"
                    size="35px"
                    font-size="25px"
                  />
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
      :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'"
    >
      <q-scroll-area class="fit" :horizontal-thumb-style="{ opacity: '0' }">
        <q-list>
          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="home" />
            </q-item-section>
            <q-item-section> Inicio </q-item-section>
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
