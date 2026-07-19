export type ServiceIllustration = {
  id: string;
  title: string;
  imageUrl: string;
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
  createdAt: string;
  updatedAt: string;
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
  };
};
