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
  type: string;
  value: string;
};

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
  value: string;
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
    businessTypeId: string | null;
    logoFile: File | null;
  };
  businessLayout: {
    primaryColor: string;
    secondaryColor: string;
    theme: string;
    settings: {
      fontFamily: string;
    };
  };
  businessChannels: {
    type: string;
    status: "ACTIVE";
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

export const useOnboarding = () => {
  const businessName = ref("");
  const businessType = ref("");
  const slug = ref("");
  const businessDescription = ref("");
  const logoFile = ref<File | null>(null);
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
    { type: "whatsapp", value: "" },
    { type: "instagram", value: "" },
    { type: "facebook", value: "" },
  ]);

  const businessTypes: OnboardingOption[] = [
    {
      label: "Barbearia",
      value: "barbearia",
    },
    {
      label: "Cabeleireiro",
      value: "cabeleireiro",
    },
    {
      label: "Estética",
      value: "estetica",
    },
    {
      label: "Outros",
      value: "outros",
    },
  ];

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
      name: "Twitter",
      icon: "mdi-twitter",
      value: "twitter",
      placeholder: "@minhaloja",
      color: "#1DA1F2",
    },
    {
      name: "YouTube",
      icon: "mdi-youtube",
      value: "youtube",
      placeholder: "youtube.com/@minhaloja",
      color: "#FF0000",
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
      businessTypeId: businessType.value || null,
      logoFile: logoFile.value,
    },
    businessLayout: {
      primaryColor: primaryColor.value,
      secondaryColor: secondaryColor.value,
      theme: "default",
      settings: {
        fontFamily: fontFamily.value,
      },
    },
    businessChannels: channelSelected.value
      .filter((channel) => channel.type && channel.value)
      .map((channel) => ({
        type: channel.type.toUpperCase(),
        status: "ACTIVE",
        channel: channel.value,
      })),
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

  return {
    address,
    businessDescription,
    businessName,
    businessType,
    businessTypes,
    channelOptions,
    channelSelected,
    createBusinessPayload,
    fontFamily,
    fontOptions,
    logoFile,
    notHaveNumber,
    primaryColor,
    secondaryColor,
    slug,
    states,
    workingHours,
  };
};
