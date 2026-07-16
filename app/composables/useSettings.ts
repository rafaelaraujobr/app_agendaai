import type {
  CreateBusinessPayload,
  OnboardingAddress,
  OnboardingChannel,
  OnboardingChannelOption,
  OnboardingOption,
  OnboardingWorkingHour,
} from "~/composables/useOnboarding";

export type SettingsSection =
  | "profile"
  | "access"
  | "appearance"
  | "channels"
  | "address"
  | "hours";

export type SettingsForm = {
  businessName: string;
  businessType: string;
  businessPhone: string;
  businessDescription: string;
  slug: string;
  logoUrl: string | null;
  logoFile: File | null;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  channels: OnboardingChannel[];
  address: OnboardingAddress;
  notHaveNumber: boolean;
  locationConfirmed: boolean;
  workingHours: OnboardingWorkingHour[];
};

type SettingsBusiness = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logoUrl: string | null;
  phone: string | null;
  businessType: { slug: string } | null;
  businessLayout: {
    primaryColor: string | null;
    secondaryColor: string | null;
    theme: string | null;
    settings: unknown | null;
  } | null;
  businessChannels: Array<{ type: string; channel: string }>;
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
  businessWorkingHours: OnboardingWorkingHour[];
};

type SettingsResponse = {
  business: SettingsBusiness;
};

type BusinessTypesResponse = {
  businessTypes: Array<{
    id: string;
    name: string;
    slug: string;
    description: string | null;
  }>;
};

type UploadImageResponse = { url: string };
type SlugAvailabilityResponse = { available: boolean };
type GeocodingResponse = {
  latitude: number;
  longitude: number;
};

const defaultWorkingHours: OnboardingWorkingHour[] = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
].map((dayOfWeek, index) => ({
  dayOfWeek: dayOfWeek as OnboardingWorkingHour["dayOfWeek"],
  startMinutes: 540,
  endMinutes: index === 5 ? 780 : 1080,
  breakStartMinutes: index < 5 ? 720 : null,
  breakEndMinutes: index < 5 ? 780 : null,
  isActive: index < 6,
}));

const createDefaultForm = (): SettingsForm => ({
  businessName: "",
  businessType: "",
  businessPhone: "",
  businessDescription: "",
  slug: "",
  logoUrl: null,
  logoFile: null,
  primaryColor: "#1976d2",
  secondaryColor: "#26a69a",
  fontFamily: "Inter",
  channels: [],
  address: {
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Brasil",
    latitude: 0,
    longitude: 0,
  },
  notHaveNumber: false,
  locationConfirmed: false,
  workingHours: defaultWorkingHours,
});

const getErrorMessage = (error: unknown) => {
  if (typeof error === "object" && error !== null) {
    const apiError = error as {
      data?: { statusMessage?: string; message?: string };
      statusMessage?: string;
      message?: string;
    };
    return (
      apiError.data?.statusMessage ||
      apiError.data?.message ||
      apiError.statusMessage ||
      apiError.message ||
      "Não foi possível salvar as configurações"
    );
  }
  return "Não foi possível salvar as configurações";
};

export const useSettings = () => {
  const $q = useQuasar();
  const { fetch: refreshSession } = useUserSession();
  const form = ref<SettingsForm>(createDefaultForm());
  const businessTypes = ref<OnboardingOption[]>([]);
  const isLoading = ref(false);
  const isSaving = ref(false);
  const savingSection = ref<SettingsSection | null>(null);
  const originalSlug = ref("");
  const originalAddress = ref("");

  const channelOptions: OnboardingChannelOption[] = [
    {
      name: "WhatsApp",
      icon: "mdi-whatsapp",
      value: "whatsapp",
      placeholder: "(21) 99999-9999",
      color: "#25D366",
    },
    {
      name: "Instagram",
      icon: "mdi-instagram",
      value: "instagram",
      placeholder: "@minhaloja",
      color: "#E4405F",
    },
    {
      name: "Facebook",
      icon: "mdi-facebook",
      value: "facebook",
      placeholder: "@minhaloja",
      color: "#1877F2",
    },
    {
      name: "Telegram",
      icon: "mdi-send",
      value: "telegram",
      placeholder: "@minhaloja",
      color: "#229ED9",
    },
  ];

  const fontOptions: OnboardingOption[] = [
    { label: "Inter", value: "Inter" },
    { label: "Roboto", value: "Roboto" },
    { label: "Montserrat", value: "Montserrat" },
    { label: "Poppins", value: "Poppins" },
  ];

  const hydrateForm = (business: SettingsBusiness) => {
    const settings =
      typeof business.businessLayout?.settings === "object" &&
      business.businessLayout.settings !== null
        ? (business.businessLayout.settings as { fontFamily?: string })
        : {};
    const address = business.businessAddress;

    form.value = {
      businessName: business.name,
      businessType: business.businessType?.slug ?? "",
      businessPhone: business.phone ?? "",
      businessDescription: business.description ?? "",
      slug: business.slug,
      logoUrl: business.logoUrl,
      logoFile: null,
      primaryColor: business.businessLayout?.primaryColor ?? "#1976d2",
      secondaryColor: business.businessLayout?.secondaryColor ?? "#26a69a",
      fontFamily: settings.fontFamily ?? "Inter",
      channels: business.businessChannels.map((channel) => ({
        type: channel.type.toLowerCase() as OnboardingChannel["type"],
        value: channel.channel,
      })),
      address: {
        street: address?.address ?? "",
        number: address?.number ?? "",
        complement: address?.complement ?? "",
        neighborhood: address?.neighborhood ?? "",
        city: address?.city ?? "",
        state: address?.state ?? "",
        zipCode: address?.zip ?? "",
        country: address?.country ?? "Brasil",
        latitude: address?.latitude ?? 0,
        longitude: address?.longitude ?? 0,
      },
      notHaveNumber: Boolean(address && !address.number),
      locationConfirmed: Boolean(address?.latitude && address?.longitude),
      workingHours:
        business.businessWorkingHours.length > 0
          ? business.businessWorkingHours
          : defaultWorkingHours,
    };
    originalSlug.value = business.slug;
    originalAddress.value = JSON.stringify({
      ...form.value.address,
      latitude: 0,
      longitude: 0,
    });
  };

  const loadSettings = async () => {
    isLoading.value = true;
    try {
      const [settingsResponse, typesResponse] = await Promise.all([
        $fetch<SettingsResponse>("/api/businesses/current"),
        $fetch<BusinessTypesResponse>("/api/businesses/types"),
      ]);
      businessTypes.value = typesResponse.businessTypes.map((type) => ({
        label: type.name,
        value: type.slug,
      }));
      hydrateForm(settingsResponse.business);
    } catch (error) {
      $q.notify({ type: "negative", message: getErrorMessage(error) });
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  const validateSection = (section: SettingsSection) => {
    const value = form.value;
    if (section === "profile") {
      if (value.businessName.trim().length < 2) return "Informe o nome do negócio";
      if (!value.businessType) return "Selecione a área de atuação";
      if (!value.businessPhone.trim()) return "Informe o WhatsApp do negócio";
    }
    if (
      section === "access" &&
      (value.slug.length < 2 ||
        !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.slug))
    ) {
      return "Informe um link de acesso válido";
    }
    if (section === "appearance") {
      if (!value.primaryColor || !value.secondaryColor || !value.fontFamily) {
        return "Preencha as cores e a fonte da página";
      }
    }
    if (section === "channels") {
      const completed = value.channels.filter(
        (channel) => channel.type && channel.value.trim(),
      );
      if (new Set(completed.map((channel) => channel.type)).size !== completed.length) {
        return "Não é permitido repetir canais";
      }
    }
    if (section === "address") {
      if (value.address.street.trim().length < 2) return "Informe o endereço";
      if (value.address.city.trim().length < 2) return "Informe a cidade";
      if (value.address.state.trim().length < 2) return "Informe o estado";
      if (!value.notHaveNumber && !value.address.number.trim()) {
        return "Informe o número ou marque sem número";
      }
    }
    if (
      section === "hours" &&
      !value.workingHours.some((workingHour) => workingHour.isActive)
    ) {
      return "Ative pelo menos um dia de atendimento";
    }
    return null;
  };

  const uploadLogo = async () => {
    if (!form.value.logoFile) return form.value.logoUrl;
    const body = new FormData();
    body.append("file", form.value.logoFile, form.value.logoFile.name);
    const upload = await $fetch<UploadImageResponse>("/api/uploads/images", {
      method: "POST",
      body,
    });
    form.value.logoUrl = upload.url;
    form.value.logoFile = null;
    return upload.url;
  };

  const geocodeAddressIfNeeded = async () => {
    const comparableAddress = JSON.stringify({
      ...form.value.address,
      latitude: 0,
      longitude: 0,
    });
    if (
      comparableAddress === originalAddress.value ||
      form.value.locationConfirmed
    ) {
      return;
    }
    const address = form.value.address;
    const response = await $fetch<{ location: GeocodingResponse }>(
      "/api/geocoding/address",
      {
        method: "POST",
        body: {
          street: address.street,
          number: form.value.notHaveNumber ? "" : address.number,
          neighborhood: address.neighborhood,
          city: address.city,
          state: address.state,
          zipCode: address.zipCode,
          country: address.country,
        },
      },
    );
    address.latitude = response.location.latitude;
    address.longitude = response.location.longitude;
    form.value.locationConfirmed = true;
  };

  const createPayload = (): CreateBusinessPayload => ({
    business: {
      name: form.value.businessName,
      slug: form.value.slug,
      description: form.value.businessDescription || null,
      businessTypeSlug: form.value.businessType || null,
      logoUrl: form.value.logoUrl,
      phone: form.value.businessPhone || null,
    },
    businessLayout: {
      primaryColor: form.value.primaryColor,
      secondaryColor: form.value.secondaryColor,
      theme: "default",
      settings: { fontFamily: form.value.fontFamily },
    },
    businessChannels: form.value.channels.flatMap((channel) => {
      if (!channel.type || !channel.value.trim()) return [];
      return [
        {
          type: channel.type.toUpperCase() as Uppercase<
            Exclude<OnboardingChannel["type"], "">
          >,
          channel: channel.value.trim(),
        },
      ];
    }),
    businessAddress: {
      address: form.value.address.street,
      number: form.value.notHaveNumber ? null : form.value.address.number || null,
      complement: form.value.address.complement || null,
      neighborhood: form.value.address.neighborhood || null,
      city: form.value.address.city,
      state: form.value.address.state,
      zip: form.value.address.zipCode || null,
      country: form.value.address.country,
      latitude: form.value.address.latitude || null,
      longitude: form.value.address.longitude || null,
    },
    businessWorkingHours: form.value.workingHours,
  });

  const saveSettings = async (section: SettingsSection) => {
    const validationMessage = validateSection(section);
    if (validationMessage) {
      $q.notify({ type: "warning", message: validationMessage });
      return false;
    }

    isSaving.value = true;
    savingSection.value = section;
    try {
      if (section === "access" && form.value.slug !== originalSlug.value) {
        const availability = await $fetch<SlugAvailabilityResponse>(
          "/api/businesses/slug-availability",
          { query: { slug: form.value.slug } },
        );
        if (!availability.available) {
          throw new Error("Este link de acesso já está em uso");
        }
      }
      await uploadLogo();
      if (section === "address") await geocodeAddressIfNeeded();
      const response = await $fetch<SettingsResponse>("/api/businesses/current", {
        method: "PATCH",
        body: createPayload(),
      });
      hydrateForm(response.business);
      await refreshSession();
      $q.notify({ type: "positive", message: "Configurações salvas com sucesso" });
      return true;
    } catch (error) {
      $q.notify({ type: "negative", message: getErrorMessage(error) });
      return false;
    } finally {
      isSaving.value = false;
      savingSection.value = null;
    }
  };

  return {
    businessTypes,
    channelOptions,
    fontOptions,
    form,
    isLoading,
    isSaving,
    loadSettings,
    saveSettings,
    savingSection,
  };
};
