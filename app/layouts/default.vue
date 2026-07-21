<template>
  <q-layout view="hHh Lpr lff">
    <q-header
      class="xs"
      bordered
      :class="$q.dark.isActive ? 'bg-grey-9 text-white' : 'bg-white text-black'"
    >
      <q-toolbar class="q-px-sm">
        <q-btn
          flat
          @click="drawer = !drawer"
          dense
          icon="menu"
          padding="sm md"
        />
        <q-toolbar-title @click="navigateTo('/')" class="cursor-pointer">
          agendaih
        </q-toolbar-title>
        <div class="q-gutter-x-sm">
          <q-btn dense padding="sm" flat>
            <q-avatar v-if="user?.avatarUrl" size="30px" bg-color="grey-3">
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
      :mini="miniState"
      :mini-width="70"
      :width="250"
      bordered
      show-if-above
      @mouseenter="miniState = false"
      @mouseleave="miniState = true"
      mini-to-overlay
      :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-w'"
    >
      <SideBarMenu v-model:miniState="miniState" />
    </q-drawer>
    <q-page-container>
      <slot />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import useAuth from "~/composables/useAuth";
import SideBarMenu from "~/components/common/SideBarMenu.vue";
const { logout, user } = useAuth();
const drawer = ref<boolean>(true);
const miniState = ref<boolean>(true);

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
</script>

<style scoped lang="sass">

:deep(.q-img__image)
  width: auto !important
</style>
