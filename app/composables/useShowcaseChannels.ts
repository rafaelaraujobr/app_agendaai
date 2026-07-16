import type { PublicBusinessChannelType } from "~/types/public-business";

export const showcaseChannelIcons: Record<PublicBusinessChannelType, string> = {
  WHATSAPP: "mdi-whatsapp",
  TELEGRAM: "mdi-send",
  INSTAGRAM: "mdi-instagram",
  FACEBOOK: "mdi-facebook",
};

export const showcaseChannelLabels: Record<PublicBusinessChannelType, string> =
  {
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

export const getShowcaseChannelUrl = (
  type: PublicBusinessChannelType,
  value: string,
) => {
  if (type === "WHATSAPP") {
    return `https://wa.me/${value.replace(/\D/g, "")}`;
  }

  const handle = getHandle(value);
  if (type === "TELEGRAM") return `https://t.me/${handle}`;
  if (type === "INSTAGRAM") return `https://instagram.com/${handle}`;
  return `https://facebook.com/${handle}`;
};

export const useShowcaseWhatsapp = (
  business: Ref<{
    name: string;
    phone: string | null;
    businessChannels: Array<{
      type: PublicBusinessChannelType;
      channel: string;
    }>;
  } | null>,
) => {
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

  return { whatsappUrl, getServiceWhatsappUrl };
};
