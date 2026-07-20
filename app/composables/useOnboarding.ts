import type { ShowcaseLayouts } from "~/types/showcase-layout";

export type OnboardingAddress = {
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  latitude: number;
  longitude: number;
};

export type OnboardingChannel = {
  type: OnboardingChannelType | "";
  value: string;
};

export type OnboardingChannelType =
  | "whatsapp"
  | "telegram"
  | "instagram"
  | "facebook";

export type OnboardingDayOfWeek =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

export type OnboardingWorkingHour = {
  dayOfWeek: OnboardingDayOfWeek;
  startMinutes: number;
  endMinutes: number;
  breakStartMinutes: number | null;
  breakEndMinutes: number | null;
  isActive: boolean;
};

export type OnboardingOption = {
  label: string;
  value: string;
};

export type OnboardingChannelOption = {
  name: string;
  icon: string;
  value: OnboardingChannelType;
  placeholder: string;
  color: string;
  prefix?: string;
  mask?: string;
};

export type CreateBusinessPayload = {
  business: {
    name: string;
    slug: string;
    description: string | null;
    businessTypeSlug: string | null;
    logoUrl: string | null;
    phone: string | null;
  };
  businessLayout: {
    primaryColor: string;
    secondaryColor: string;
    theme: string;
    settings: {
      fontFamily: string;
      showcaseLayouts?: ShowcaseLayouts;
    };
  };
  businessChannels: {
    type: Uppercase<OnboardingChannelType>;
    channel: string;
  }[];
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
  };
  businessWorkingHours: OnboardingWorkingHour[];
};

type BusinessTypesResponse = {
  businessTypes: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
  }[];
};

type UploadImageResponse = {
  url: string;
};

type SlugAvailabilityResponse = {
  available: boolean;
};

const createOnboardingError = (message: string, step?: number) =>
  Object.assign(new Error(message), { step });

export const useOnboarding = () => {
  const businessName = ref("");
  const businessType = ref("");
  const businessPhone = ref("");
  const slug = ref("");
  const businessDescription = ref("");
  const logoFile = ref<File | null>(null);
  const logoUrl = ref<string | null>(null);
  const businessTypes = ref<OnboardingOption[]>([]);
  const isLoadingBusinessTypes = ref(false);
  const isCreating = ref(false);
  watch(logoFile, () => {
    logoUrl.value = null;
  });
  const notHaveNumber = ref(false);
  const primaryColor = ref("#1976d2");
  const secondaryColor = ref("#26a69a");
  const fontFamily = ref("Inter");
  const workingHours = ref<OnboardingWorkingHour[]>([
    {
      dayOfWeek: "MONDAY",
      startMinutes: 540,
      endMinutes: 1080,
      breakStartMinutes: 720,
      breakEndMinutes: 780,
      isActive: true,
    },
    {
      dayOfWeek: "TUESDAY",
      startMinutes: 540,
      endMinutes: 1080,
      breakStartMinutes: 720,
      breakEndMinutes: 780,
      isActive: true,
    },
    {
      dayOfWeek: "WEDNESDAY",
      startMinutes: 540,
      endMinutes: 1080,
      breakStartMinutes: 720,
      breakEndMinutes: 780,
      isActive: true,
    },
    {
      dayOfWeek: "THURSDAY",
      startMinutes: 540,
      endMinutes: 1080,
      breakStartMinutes: 720,
      breakEndMinutes: 780,
      isActive: true,
    },
    {
      dayOfWeek: "FRIDAY",
      startMinutes: 540,
      endMinutes: 1080,
      breakStartMinutes: 720,
      breakEndMinutes: 780,
      isActive: true,
    },
    {
      dayOfWeek: "SATURDAY",
      startMinutes: 540,
      endMinutes: 780,
      breakStartMinutes: null,
      breakEndMinutes: null,
      isActive: true,
    },
    {
      dayOfWeek: "SUNDAY",
      startMinutes: 540,
      endMinutes: 780,
      breakStartMinutes: null,
      breakEndMinutes: null,
      isActive: false,
    },
  ]);

  const address = ref<OnboardingAddress>({
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "Rio de Janeiro",
    state: "RJ",
    zipCode: "",
    country: "Brasil",
    latitude: 0,
    longitude: 0,
  });

  const channelSelected = ref<OnboardingChannel[]>([
    { type: "instagram", value: "" },
    { type: "facebook", value: "" },
  ]);

  const states: OnboardingOption[] = [
    {
      label: "Rio de Janeiro",
      value: "RJ",
    },
    {
      label: "São Paulo",
      value: "SP",
    },
    {
      label: "Minas Gerais",
      value: "MG",
    },
    {
      label: "Bahia",
      value: "BA",
    },
    {
      label: "Ceará",
      value: "CE",
    },
    {
      label: "Paraná",
      value: "PR",
    },
    {
      label: "Rio Grande do Sul",
      value: "RS",
    },
    {
      label: "Mato Grosso do Sul",
      value: "MS",
    },
    {
      label: "Mato Grosso",
      value: "MT",
    },
    {
      label: "Goiás",
      value: "GO",
    },
    {
      label: "Distrito Federal",
      value: "DF",
    },
    {
      label: "Espírito Santo",
      value: "ES",
    },
    {
      label: "Rio Grande do Norte",
      value: "RN",
    },
    {
      label: "Pernambuco",
      value: "PE",
    },
    {
      label: "Alagoas",
      value: "AL",
    },
  ];

  const channelOptions: OnboardingChannelOption[] = [
    {
      name: "WhatsApp",
      icon: "mdi-whatsapp",
      value: "whatsapp",
      prefix: "+55",
      mask: "(##) #####-####",
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
    {
      label: "Inter",
      value: "Inter",
    },
    {
      label: "Roboto",
      value: "Roboto",
    },
    {
      label: "Montserrat",
      value: "Montserrat",
    },
    {
      label: "Poppins",
      value: "Poppins",
    },
  ];

  const createBusinessPayload = computed<CreateBusinessPayload>(() => ({
    business: {
      name: businessName.value,
      slug: slug.value,
      description: businessDescription.value || null,
      businessTypeSlug: businessType.value || null,
      logoUrl: logoUrl.value,
      phone: businessPhone.value || null,
    },
    businessLayout: {
      primaryColor: primaryColor.value,
      secondaryColor: secondaryColor.value,
      theme: "default",
      settings: {
        fontFamily: fontFamily.value,
      },
    },
    businessChannels: channelSelected.value.flatMap((channel) => {
      const value = channel.value.trim();
      if (!channel.type || !value) return [];

      return [
        {
          type: channel.type.toUpperCase() as Uppercase<OnboardingChannelType>,
          channel: value,
        },
      ];
    }),
    businessAddress: {
      address: address.value.street,
      number: notHaveNumber.value ? null : address.value.number || null,
      complement: address.value.complement || null,
      neighborhood: address.value.neighborhood || null,
      city: address.value.city,
      state: address.value.state,
      zip: address.value.zipCode || null,
      country: address.value.country,
      latitude: address.value.latitude || null,
      longitude: address.value.longitude || null,
    },
    businessWorkingHours: workingHours.value.map((workingHour) => ({
      ...workingHour,
    })),
  }));

  const loadBusinessTypes = async () => {
    isLoadingBusinessTypes.value = true;

    try {
      const response = await $fetch<BusinessTypesResponse>(
        "/api/businesses/types",
      );
      businessTypes.value = response.businessTypes.map((businessType) => ({
        label: businessType.name,
        value: businessType.slug,
      }));
    } finally {
      isLoadingBusinessTypes.value = false;
    }
  };

  const checkSlugAvailability = async (value: string) => {
    const response = await $fetch<SlugAvailabilityResponse>(
      "/api/businesses/slug-availability",
      { query: { slug: value } },
    );

    return response.available;
  };

  const validateOnboardingData = () => {
    const payload = createBusinessPayload.value;
    const {
      business,
      businessAddress,
      businessChannels,
      businessWorkingHours,
    } = payload;

    if (business.name.trim().length < 2) return "Informe o nome do negócio";
    if (!business.businessTypeSlug) return "Selecione a área de atuação";
    if (
      business.slug.length < 2 ||
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(business.slug)
    ) {
      return "Informe um slug válido";
    }
    if (!business.phone?.trim()) return "Informe o WhatsApp do negócio";
    if (!logoFile.value && !logoUrl.value) {
      return "Selecione o logotipo do negócio";
    }
    if (businessAddress.address.trim().length < 2) return "Informe o endereço";
    if (businessAddress.city.trim().length < 2) return "Informe a cidade";
    if (businessAddress.state.trim().length < 2) return "Informe o estado";

    const channelTypes = businessChannels.map((channel) => channel.type);
    if (new Set(channelTypes).size !== channelTypes.length) {
      return "Não é permitido repetir canais de atendimento";
    }

    if (!businessWorkingHours.some((workingHour) => workingHour.isActive)) {
      return "Configure pelo menos um dia de atendimento";
    }

    const hasInvalidWorkingHour = businessWorkingHours.some((workingHour) => {
      if (!workingHour.isActive) return false;
      if (workingHour.endMinutes <= workingHour.startMinutes) return true;

      const hasBreakStart = workingHour.breakStartMinutes !== null;
      const hasBreakEnd = workingHour.breakEndMinutes !== null;
      if (hasBreakStart !== hasBreakEnd) return true;

      return (
        workingHour.breakStartMinutes !== null &&
        workingHour.breakEndMinutes !== null &&
        (workingHour.breakStartMinutes < workingHour.startMinutes ||
          workingHour.breakEndMinutes > workingHour.endMinutes ||
          workingHour.breakEndMinutes <= workingHour.breakStartMinutes)
      );
    });

    if (hasInvalidWorkingHour) return "Revise os horários de funcionamento";

    return null;
  };

  const uploadLogo = async () => {
    if (logoUrl.value) return logoUrl.value;
    if (!logoFile.value) {
      throw createOnboardingError("Selecione o logotipo do negócio", 3);
    }

    const formData = new FormData();
    formData.append("file", logoFile.value, logoFile.value.name);

    const upload = await $fetch<UploadImageResponse>("/api/uploads/images", {
      method: "POST",
      body: formData,
    });
    logoUrl.value = upload.url;

    return upload.url;
  };

  const createBusiness = async () => {
    if (isCreating.value) return;

    isCreating.value = true;

    try {
      const validationMessage = validateOnboardingData();
      if (validationMessage) {
        throw createOnboardingError(validationMessage);
      }

      const isSlugAvailable = await checkSlugAvailability(slug.value);
      if (!isSlugAvailable) {
        throw createOnboardingError(
          "Este endereço já está em uso. Escolha outro slug.",
          2,
        );
      }

      await uploadLogo();

      return await $fetch("/api/businesses", {
        method: "POST",
        body: createBusinessPayload.value,
      });
    } finally {
      isCreating.value = false;
    }
  };

  return {
    address,
    businessDescription,
    businessName,
    businessPhone,
    businessType,
    businessTypes,
    channelOptions,
    channelSelected,
    checkSlugAvailability,
    createBusiness,
    createBusinessPayload,
    fontFamily,
    fontOptions,
    logoFile,
    logoUrl,
    isCreating,
    isLoadingBusinessTypes,
    loadBusinessTypes,
    notHaveNumber,
    primaryColor,
    secondaryColor,
    slug,
    states,
    uploadLogo,
    validateOnboardingData,
    workingHours,
  };
};
