export type ServiceIllustration = {
  id: string;
  title: string;
  imageUrl: string;
};

export type ServiceHighlightSummary = {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  position: number;
  isActive: boolean;
  startsAt: string | null;
  endsAt: string | null;
};

export type ManagedService = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  illustrationId: string | null;
  illustration: ServiceIllustration | null;
  durationMinutes: number;
  price: number;
  isActive: boolean;
  position: number;
  appointmentCount: number;
  highlight: ServiceHighlightSummary | null;
  createdAt: string;
  updatedAt: string;
};

export type ServiceHighlightForm = {
  enabled: boolean;
  id: string | null;
  title: string;
  description: string;
  imageUrl: string | null;
  imageFile: File | null;
  isActive: boolean;
  startsAt: string;
  endsAt: string;
  position: number | null;
};

export type ServiceForm = {
  name: string;
  slug: string;
  description: string;
  imageUrl: string | null;
  imageFile: File | null;
  illustrationId: string | null;
  durationMinutes: number | null;
  price: number | null;
  isActive: boolean;
  position: number | null;
  highlight: ServiceHighlightForm;
};

export type ServiceFilters = {
  page: number;
  pageSize: number;
  search: string;
  status: "all" | "active" | "inactive";
  sortBy: "position" | "name" | "price" | "createdAt";
  sortOrder: "asc" | "desc";
};

export type ServicesResponse = {
  services: ManagedService[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  summary: {
    activeCount: number;
    totalCount: number;
    maxServices: number | null;
    plan: "FREE" | "PRO" | "PREMIUM" | null;
    highlightsCount: number;
    maxHighlights: number;
  };
};

export type ServiceHighlight = {
  id: string;
  serviceId: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  position: number;
  isActive: boolean;
  startsAt: string | null;
  endsAt: string | null;
  createdAt: string;
  updatedAt: string;
  service: {
    id: string;
    name: string;
    imageUrl: string | null;
    isActive: boolean;
    illustration: {
      imageUrl: string;
    } | null;
  };
};

export type ServiceHighlightsResponse = {
  highlights: ServiceHighlight[];
  maxHighlights: number;
};
