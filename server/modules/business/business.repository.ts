import { prisma } from "../../utils/db";
import type { CreateBusinessSchema } from "./business.schema";
import {
  ChannelStatus,
  MemberRole,
  MemberStatus,
  PlanCode,
  SubscriptionStatus,
} from "~~/prisma/generated/enums";

type CreateCompleteBusinessInput = {
  userId: string;
  businessTypeId: string | null;
  planId: string;
  payload: CreateBusinessSchema;
};

export const businessRepository = {
  findBusinessTypes: async () => {
    return await prisma.businessType.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
      },
    });
  },

  findBySlug: async (slug: string) => {
    return await prisma.business.findUnique({
      where: { slug },
      select: { id: true },
    });
  },

  findBusinessTypeBySlug: async (slug: string) => {
    return await prisma.businessType.findUnique({
      where: { slug },
      select: { id: true },
    });
  },

  findFreePlan: async () => {
    return await prisma.plan.findUnique({
      where: { code: PlanCode.FREE },
      select: { id: true },
    });
  },

  createComplete: async ({
    userId,
    businessTypeId,
    planId,
    payload,
  }: CreateCompleteBusinessInput) => {
    const {
      business,
      businessAddress,
      businessChannels,
      businessLayout,
      businessWorkingHours,
    } = payload;

    // Nested writes são executados atomicamente pelo Prisma.
    return await prisma.business.create({
      data: {
        name: business.name,
        slug: business.slug,
        description: business.description,
        logoUrl: business.logoUrl,
        phone: business.phone,
        businessType: businessTypeId
          ? { connect: { id: businessTypeId } }
          : undefined,
        businessMembers: {
          create: {
            user: { connect: { id: userId } },
            role: MemberRole.OWNER,
            status: MemberStatus.ACTIVE,
          },
        },
        businessSubscription: {
          create: {
            plan: { connect: { id: planId } },
            status: SubscriptionStatus.ACTIVE,
          },
        },
        businessLayout: {
          create: businessLayout,
        },
        businessAddresses: {
          create: businessAddress,
        },
        businessChannels: {
          create: businessChannels.map((channel) => ({
            ...channel,
            status: ChannelStatus.ACTIVE,
          })),
        },
        businessWorkingHours: {
          create: businessWorkingHours,
        },
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        logoUrl: true,
        bannerUrl: true,
        phone: true,
        businessTypeId: true,
        createdAt: true,
        updatedAt: true,
        businessType: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });
  },
};
