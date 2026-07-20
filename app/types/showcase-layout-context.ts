import type { PublicBusiness } from "./public-business";

export type ShowcaseLayoutContext = {
  business: PublicBusiness;
  primaryColor: string;
  secondaryColor: string;
  sortedWorkingHours: PublicBusiness["businessWorkingHours"];
  formattedAddress: string;
  googleMapsUrl: string;
  wazeMapsUrl: string;
  hasCoordinates: boolean;
  mapCenter: [number, number];
  whatsappUrl: string | null;
  getServiceWhatsappUrl: (serviceName: string) => string | null;
};

export type ServiceHighlight = PublicBusiness["serviceHighlights"][number];
