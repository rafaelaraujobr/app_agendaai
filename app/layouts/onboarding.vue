<template>
  <q-layout view="hHh Lpr lff">
    <q-header reveal :class="$q.dark.isActive ? 'bg-secondary' : 'bg-black'">
      <q-toolbar>
        <q-toolbar-title>
          <q-img :src="logoImage" alt="Logo do sistema" style="height: 30px;" fit="contain" />
        </q-toolbar-title>
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
    <q-page-container>
      <pre>{{ user }}</pre>
      <slot />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import useAuth from "~/composables/useAuth";
import logoImage from "~/assets/images/logo-white.svg";
const { logout, user } = useAuth();

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
