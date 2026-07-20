import type { Prisma } from "~~/prisma/generated/client";

const sessionBusinessSelect = {
  id: true,
  name: true,
  slug: true,
  businessType: {
    select: {
      id: true,
      name: true,
    },
  },
  businessChannels: {
    select: {
      id: true,
      type: true,
      channel: true,
    },
  },
  businessWorkingHours: {
    select: {
      id: true,
      dayOfWeek: true,
      startMinutes: true,
      endMinutes: true,
    },
  },
  businessLayout: {
    select: {
      id: true,
      primaryColor: true,
      secondaryColor: true,
      theme: true,
    },
  },
  businessSubscription: {
    select: {
      plan: {
        select: {
          maxServices: true,
          maxCollaborators: true,
        },
      },
    },
  },
  _count: {
    select: {
      services: true,
      businessMembers: true,
      customers: true,
    },
  },
} as const;

export type SessionBusinessSource = Prisma.BusinessGetPayload<{
  select: typeof sessionBusinessSelect;
}>;

export const sessionBusinessSelectFields = sessionBusinessSelect;

export function mapSessionBusiness(business: SessionBusinessSource | null) {
  if (!business) return null;

  const plan = business.businessSubscription?.plan;

  return {
    id: business.id,
    name: business.name,
    slug: business.slug,
    businessType: business.businessType,
    businessChannels: business.businessChannels,
    businessWorkingHours: business.businessWorkingHours,
    businessLayout: business.businessLayout,
    maxServices: plan?.maxServices ?? null,
    maxCollaborators: plan?.maxCollaborators ?? null,
    servicesCount: business._count.services,
    collaboratorsCount: business._count.businessMembers,
    customersCount: business._count.customers,
  };
}

type SessionUserSource = {
  id: string;
  firstName: string;
  lastName: string | null;
  email: string;
  avatarUrl: string | null;
  preferences: {
    id: string;
    theme: string | null;
    currency: string | null;
    timezone: string | null;
    language: string | null;
  } | null;
  businessMembers: Array<{
    business: SessionBusinessSource | null;
  }>;
};

export function mapSessionUser(user: SessionUserSource) {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName ?? "",
    email: user.email,
    avatarUrl: user.avatarUrl ?? "",
    preferences: user.preferences ?? {},
    business: mapSessionBusiness(user.businessMembers[0]?.business ?? null),
  };
}
