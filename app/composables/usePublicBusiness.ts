import type {
  PublicBusiness,
  PublicBusinessResponse,
} from "~/types/public-business";

export const showcaseDayLabels: Record<
  PublicBusiness["businessWorkingHours"][number]["dayOfWeek"],
  string
> = {
  MONDAY: "Segunda-feira",
  TUESDAY: "Terça-feira",
  WEDNESDAY: "Quarta-feira",
  THURSDAY: "Quinta-feira",
  FRIDAY: "Sexta-feira",
  SATURDAY: "Sábado",
  SUNDAY: "Domingo",
};

const dayOrder = Object.keys(showcaseDayLabels) as Array<
  keyof typeof showcaseDayLabels
>;

export const minutesToShowcaseTime = (minutes: number) => {
  const hours = Math.floor(minutes / 60)
    .toString()
    .padStart(2, "0");
  const remainingMinutes = (minutes % 60).toString().padStart(2, "0");
  return `${hours}:${remainingMinutes}`;
};

export const formatShowcaseWorkingHour = (
  workingHour: PublicBusiness["businessWorkingHours"][number],
) => {
  if (!workingHour.isActive) return "Fechado";
  return `${minutesToShowcaseTime(workingHour.startMinutes)} às ${minutesToShowcaseTime(
    workingHour.endMinutes,
  )}`;
};

export const formatShowcaseBreak = (
  workingHour: PublicBusiness["businessWorkingHours"][number],
) => {
  if (
    !workingHour.isActive ||
    workingHour.breakStartMinutes === null ||
    workingHour.breakEndMinutes === null
  ) {
    return "";
  }

  return `${minutesToShowcaseTime(workingHour.breakStartMinutes)} às ${minutesToShowcaseTime(
    workingHour.breakEndMinutes,
  )}`;
};

export const formatShowcaseCurrency = (price: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);

export const formatShowcaseDuration = (minutes: number) => {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes ? `${hours}h ${remainingMinutes}min` : `${hours}h`;
};

export const getShowcaseServiceImage = (
  service: PublicBusiness["services"][number],
) => service.imageUrl || service.illustration?.imageUrl || null;

export const usePublicBusiness = () => {
  const accessContext = useState<"institutional" | "admin" | "showcase">(
    "access-context",
    () => "institutional",
  );
  const subdomain = useState<string | null>("subdomain", () => null);

  const { data, error, status, refresh } =
    useAsyncData<PublicBusinessResponse | null>(
      "public-business",
      async () => {
        if (accessContext.value !== "showcase" || !subdomain.value) return null;

        return await $fetch<PublicBusinessResponse>("/api/businesses", {
          query: { slug: subdomain.value },
        });
      },
      {
        watch: [accessContext, subdomain],
      },
    );

  const business = computed(() => data.value?.business ?? null);

  const isBusinessNotFound = computed(() => {
    const requestError = error.value as { statusCode?: number } | null;
    return requestError?.statusCode === 404;
  });

  const primaryColor = computed(
    () => business.value?.businessLayout?.primaryColor || "#1976d2",
  );
  const secondaryColor = computed(
    () => business.value?.businessLayout?.secondaryColor || "#26a69a",
  );

  const sortedWorkingHours = computed(() =>
    [...(business.value?.businessWorkingHours || [])].sort(
      (first, second) =>
        dayOrder.indexOf(first.dayOfWeek) - dayOrder.indexOf(second.dayOfWeek),
    ),
  );
  const hasCoordinates = computed(() => {
    const address = business.value?.businessAddress;
    return Boolean(
      address &&
      address.latitude !== null &&
      address.longitude !== null &&
      address.latitude !== 0 &&
      address.longitude !== 0,
    );
  });
  const mapCenter = computed<[number, number]>(() => [
    business.value?.businessAddress?.latitude || -14.235,
    business.value?.businessAddress?.longitude || -51.9253,
  ]);
  const formattedAddress = computed(() => {
    const address = business.value?.businessAddress;
    if (!address) return "";
    const street = [address.address, address.number].filter(Boolean).join(", ");
    const district = address.neighborhood || "";
    const city = [address.city, address.state].filter(Boolean).join(" - ");
    return [street, district, city, address.zip].filter(Boolean).join(" · ");
  });

  const googleMapsUrl = computed(() => {
    const query = hasCoordinates.value
      ? mapCenter.value.join(",")
      : formattedAddress.value;
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  });

  const wazeMapsUrl = computed(() => {
    if (hasCoordinates.value) {
      const [latitude, longitude] = mapCenter.value;

      return `https://waze.com/ul?ll=${encodeURIComponent(
        `${latitude},${longitude}`,
      )}&navigate=yes`;
    }

    return `https://waze.com/ul?q=${encodeURIComponent(
      formattedAddress.value,
    )}&navigate=yes`;
  });

  return {
    business,
    status,
    refresh,
    isBusinessNotFound,
    primaryColor,
    secondaryColor,
    sortedWorkingHours,
    hasCoordinates,
    mapCenter,
    formattedAddress,
    googleMapsUrl,
    wazeMapsUrl,
  };
};
