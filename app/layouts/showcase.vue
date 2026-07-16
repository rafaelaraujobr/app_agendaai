<template>
  <q-layout view="hHh lpR fFf" class="showcase-layout" :style="{ fontFamily }">
    <q-header
      v-if="business"
      class="text-white"
      :style="{ backgroundColor: primaryColor }"
    >
      <q-toolbar class="showcase-toolbar wrapper">
        <q-toolbar-title class="row items-center no-wrap">
          <q-img
            v-if="business.logoUrl"
            :src="business.logoUrl"
            :alt="`Logo de ${business.name}`"
            fit="contain"
            class="showcase-logo"
          />
          <span v-else class="text-subtitle1 text-weight-bold ellipsis">
            {{ business.name }}
          </span>
        </q-toolbar-title>

        <div
          v-if="business.businessChannels.length"
          class="row no-wrap q-gutter-xs"
        >
          <q-btn
            v-for="channel in business.businessChannels"
            :key="channel.type"
            :icon="channelIcons[channel.type]"
            :aria-label="channelLabels[channel.type]"
            :href="getChannelUrl(channel.type, channel.channel)"
            target="_blank"
            rel="noopener noreferrer"
            flat
            round
            dense
          >
            <q-tooltip>
              {{ channelLabels[channel.type] }}: {{ channel.channel }}
            </q-tooltip>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <slot />

      <footer v-if="business" class="showcase-footer text-center text-grey-7">
        <div class="wrapper q-px-md">
          <q-separator />
          <div class="q-py-lg">
            © {{ currentYear }} {{ business.name }}. Todos os direitos
            reservados.
          </div>
        </div>
      </footer>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import type {
  PublicBusiness,
  PublicBusinessChannelType,
} from "~/types/public-business";

const business = useState<PublicBusiness | null>(
  "showcase-business",
  () => null,
);

const primaryColor = computed(
  () => business.value?.businessLayout?.primaryColor || "#1976d2",
);
const fontFamily = computed(
  () => business.value?.businessLayout?.settings?.fontFamily || "Inter",
);
const currentYear = new Date().getFullYear();

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
</script>

<style scoped>
.showcase-layout {
  min-height: 100vh;
  background: #f7f8fa;
}

.showcase-toolbar {
  min-height: 72px;
  width: 100%;
}

.showcase-logo {
  width: 140px;
  height: 46px;
}

.showcase-logo :deep(.q-img__image) {
  width: auto;
}

.showcase-footer {
  background: #fff;
}

@media (max-width: 599px) {
  .showcase-toolbar {
    min-height: 64px;
    padding-inline: 16px;
  }

  .showcase-logo {
    width: 112px;
    height: 40px;
  }
}
</style>
