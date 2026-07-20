import type { ShowcaseLayouts } from "./showcase-layout";

export type PublicBusinessChannelType =
  | "WHATSAPP"
  | "TELEGRAM"
  | "INSTAGRAM"
  | "FACEBOOK";

export type PublicBusiness = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logoUrl: string | null;
  bannerUrl: string | null;
  phone: string | null;
  businessType: {
    id: string;
    name: string;
    slug: string;
  } | null;
  businessLayout: {
    primaryColor: string | null;
    secondaryColor: string | null;
    theme: string | null;
    settings: {
      fontFamily?: string;
      showcaseLayouts?: ShowcaseLayouts;
    } | null;
  } | null;
  businessChannels: Array<{
    type: PublicBusinessChannelType;
    channel: string;
  }>;
  businessAddress: {
    address: string;
    number: string | null;
    complement: string | null;
    neighborhood: string | null;
    city: string;
    state: string;
    zip: string | null;
    country: string;
    latitude: number | null;
    longitude: number | null;
  } | null;
  businessWorkingHours: Array<{
    dayOfWeek:
      | "MONDAY"
      | "TUESDAY"
      | "WEDNESDAY"
      | "THURSDAY"
      | "FRIDAY"
      | "SATURDAY"
      | "SUNDAY";
    startMinutes: number;
    endMinutes: number;
    breakStartMinutes: number | null;
    breakEndMinutes: number | null;
    isActive: boolean;
  }>;
  services: Array<{
    id: string;
    name: string;
    slug: string;
    description: string | null;
    imageUrl: string | null;
    durationMinutes: number;
    price: number;
    position: number;
    illustration: {
      title: string;
      imageUrl: string;
    } | null;
  }>;
};

export type PublicBusinessResponse = {
  business: PublicBusiness;
};
