export const showcaseCardDefinitions = [
  {
    id: "address",
    label: "Endereço",
    icon: "mdi-map-marker-outline",
    description: "Exibe o endereço onde você atende.",
  },
  {
    id: "working-hours",
    label: "Horário de atendimento",
    icon: "mdi-clock-outline",
    description: "Mostre seus horários",
  },
  {
    id: "banner",
    label: "Banner",
    icon: "mdi-image-outline",
    description: "Imagem principal do seu negócio",
  },
  {
    id: "promotions",
    label: "Destaque",
    icon: "mdi-star-circle-outline",
    description: "Serviços em destaque",
  },
  {
    id: "featured-services",
    label: "Serviços em destaque",
    icon: "mdi-star-outline",
    description: "Lista dos principais serviços ",
  },
  {
    id: "booking-cta",
    label: "Botão de agendamento",
    icon: "mdi-calendar-check-outline",
    description: "Destaque um botão de agendamento",
  },
] as const;

export type ShowcaseCardId = (typeof showcaseCardDefinitions)[number]["id"];
export type ShowcaseDevice = "mobile" | "tablet" | "desktop";

export type ShowcaseLayoutItem = {
  i: ShowcaseCardId;
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
};

export type ShowcaseLayouts = Record<ShowcaseDevice, ShowcaseLayoutItem[]>;

const createLayout = (
  columns: number,
  heights: Record<ShowcaseCardId, number>,
): ShowcaseLayoutItem[] => [
  { i: "banner", x: 0, y: 0, w: columns, h: heights.banner, minH: 2 },
  {
    i: "promotions",
    x: 0,
    y: heights.banner,
    w: columns,
    h: heights.promotions,
    minH: 3,
  },
  {
    i: "featured-services",
    x: 0,
    y: heights.banner + heights.promotions,
    w: columns,
    h: heights["featured-services"],
    minH: 3,
  },
  {
    i: "address",
    x: 0,
    y: heights.banner + heights.promotions + heights["featured-services"],
    w: Math.max(Math.round(columns * 0.58), 1),
    h: heights.address,
    minH: 3,
  },
  {
    i: "working-hours",
    x: Math.max(Math.round(columns * 0.58), 1),
    y: heights.banner + heights.promotions + heights["featured-services"],
    w: columns - Math.max(Math.round(columns * 0.58), 1),
    h: heights["working-hours"],
    minH: 3,
  },
  {
    i: "booking-cta",
    x: 0,
    y:
      heights.banner +
      heights.promotions +
      heights["featured-services"] +
      Math.max(heights.address, heights["working-hours"]),
    w: columns,
    h: heights["booking-cta"],
    minH: 2,
  },
];

export const createDefaultShowcaseLayouts = (): ShowcaseLayouts => ({
  mobile: createLayout(4, {
    address: 7,
    "working-hours": 7,
    banner: 4,
    promotions: 5,
    "featured-services": 8,
    "booking-cta": 3,
  }).map((item, index, items) => ({
    ...item,
    x: 0,
    y: items.slice(0, index).reduce((total, current) => total + current.h, 0),
    w: 4,
  })),
  tablet: createLayout(8, {
    address: 7,
    "working-hours": 7,
    banner: 4,
    promotions: 5,
    "featured-services": 7,
    "booking-cta": 3,
  }),
  desktop: createLayout(12, {
    address: 7,
    "working-hours": 7,
    banner: 4,
    promotions: 5,
    "featured-services": 7,
    "booking-cta": 3,
  }),
});

export const showcaseDeviceColumns: Record<ShowcaseDevice, number> = {
  mobile: 4,
  tablet: 8,
  desktop: 12,
};
