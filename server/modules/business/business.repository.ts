import { prisma } from "../../utils/db";
import type {
  CreateBusinessSchema,
  UpdateCurrentBusinessSchema,
} from "./business.schema";
import type { Prisma } from "~~/prisma/generated/client";
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

type UpdateCurrentBusinessInput = {
  userId: string;
  businessTypeId: string | null;
  payload: UpdateCurrentBusinessSchema;
};

const currentBusinessSelect = {
  id: true,
  name: true,
  slug: true,
  description: true,
  logoUrl: true,
  phone: true,
  businessType: {
    select: {
      id: true,
      name: true,
      slug: true,
    },
  },
  businessLayout: {
    select: {
      primaryColor: true,
      secondaryColor: true,
      theme: true,
      settings: true,
    },
  },
  businessChannels: {
    select: {
      type: true,
      channel: true,
    },
    orderBy: {
      type: "asc",
    },
  },
  businessAddresses: {
    select: {
      address: true,
      number: true,
      complement: true,
      neighborhood: true,
      city: true,
      state: true,
      zip: true,
      country: true,
      latitude: true,
      longitude: true,
    },
  },
  businessWorkingHours: {
    select: {
      dayOfWeek: true,
      startMinutes: true,
      endMinutes: true,
      breakStartMinutes: true,
      breakEndMinutes: true,
      isActive: true,
    },
    orderBy: {
      dayOfWeek: "asc",
    },
  },
} satisfies Prisma.BusinessSelect;

export type CurrentBusiness = Prisma.BusinessGetPayload<{
  select: typeof currentBusinessSelect;
}>;

const publicBusinessSelect = {
  id: true,
  name: true,
  slug: true,
  description: true,
  logoUrl: true,
  bannerUrl: true,
  phone: true,
  businessType: {
    select: {
      id: true,
      name: true,
      slug: true,
    },
  },
  businessLayout: {
    select: {
      primaryColor: true,
      secondaryColor: true,
      theme: true,
      settings: true,
    },
  },
  businessChannels: {
    where: {
      status: ChannelStatus.ACTIVE,
    },
    select: {
      type: true,
      channel: true,
    },
    orderBy: {
      type: "asc",
    },
  },
  businessAddresses: {
    select: {
      address: true,
      number: true,
      complement: true,
      neighborhood: true,
      city: true,
      state: true,
      zip: true,
      country: true,
      latitude: true,
      longitude: true,
    },
  },
  businessWorkingHours: {
    select: {
      dayOfWeek: true,
      startMinutes: true,
      endMinutes: true,
      breakStartMinutes: true,
      breakEndMinutes: true,
      isActive: true,
    },
    orderBy: {
      dayOfWeek: "asc",
    },
  },
  services: {
    where: {
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      imageUrl: true,
      durationMinutes: true,
      price: true,
      position: true,
      illustration: {
        select: {
          title: true,
          imageUrl: true,
        },
      },
    },
    orderBy: [{ position: "asc" }, { name: "asc" }],
  },
  serviceHighlights: {
    where: {
      isActive: true,
      service: {
        isActive: true,
      },
    },
    select: {
      id: true,
      title: true,
      description: true,
      imageUrl: true,
      position: true,
      startsAt: true,
      endsAt: true,
      service: {
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          imageUrl: true,
          durationMinutes: true,
          price: true,
          illustration: {
            select: {
              title: true,
              imageUrl: true,
            },
          },
        },
      },
    },
    orderBy: [{ position: "asc" }, { createdAt: "asc" }],
  },
} satisfies Prisma.BusinessSelect;

export type PublicBusiness = Prisma.BusinessGetPayload<{
  select: typeof publicBusinessSelect;
}>;

export type UpdateCurrentBusinessResult =
  | { kind: "not_found" }
  | { kind: "forbidden" }
  | { kind: "slug_conflict" }
  | { kind: "updated"; business: CurrentBusiness };

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

  findPublicBySlug: async (slug: string) => {
    return await prisma.business.findUnique({
      where: { slug },
      select: publicBusinessSelect,
    });
  },

  findCurrentByUserId: async (userId: string) => {
    return await prisma.business.findFirst({
      where: {
        businessMembers: {
          some: {
            userId,
            status: MemberStatus.ACTIVE,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
      select: currentBusinessSelect,
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

  updateCurrentComplete: async ({
    userId,
    businessTypeId,
    payload,
  }: UpdateCurrentBusinessInput): Promise<UpdateCurrentBusinessResult> => {
    return await prisma.$transaction(async (transaction) => {
      const currentBusiness = await transaction.business.findFirst({
        where: {
          businessMembers: {
            some: {
              userId,
              status: MemberStatus.ACTIVE,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
        select: {
          id: true,
          businessMembers: {
            where: {
              userId,
              status: MemberStatus.ACTIVE,
            },
            select: {
              role: true,
            },
            take: 1,
          },
        },
      });

      if (!currentBusiness) {
        return { kind: "not_found" };
      }

      if (currentBusiness.businessMembers[0]?.role !== MemberRole.OWNER) {
        return { kind: "forbidden" };
      }

      const slugOwner = await transaction.business.findUnique({
        where: {
          slug: payload.business.slug,
        },
        select: {
          id: true,
        },
      });

      if (slugOwner && slugOwner.id !== currentBusiness.id) {
        return { kind: "slug_conflict" };
      }

      const {
        business,
        businessAddress,
        businessChannels,
        businessLayout,
        businessWorkingHours,
      } = payload;

      await transaction.business.update({
        where: {
          id: currentBusiness.id,
        },
        data: {
          name: business.name,
          slug: business.slug,
          description: business.description,
          logoUrl: business.logoUrl,
          phone: business.phone,
          businessTypeId,
        },
      });

      await transaction.businessLayout.upsert({
        where: {
          businessId: currentBusiness.id,
        },
        create: {
          businessId: currentBusiness.id,
          ...businessLayout,
        },
        update: businessLayout,
      });

      await transaction.businessAddress.upsert({
        where: {
          businessId: currentBusiness.id,
        },
        create: {
          businessId: currentBusiness.id,
          ...businessAddress,
        },
        update: businessAddress,
      });

      await transaction.businessChannel.deleteMany({
        where: {
          businessId: currentBusiness.id,
        },
      });

      await transaction.businessChannel.createMany({
        data: businessChannels.map((channel) => ({
          businessId: currentBusiness.id,
          ...channel,
          status: ChannelStatus.ACTIVE,
        })),
      });

      await transaction.businessWorkingHour.deleteMany({
        where: {
          businessId: currentBusiness.id,
        },
      });

      await transaction.businessWorkingHour.createMany({
        data: businessWorkingHours.map((workingHour) => ({
          businessId: currentBusiness.id,
          ...workingHour,
        })),
      });

      const updatedBusiness = await transaction.business.findUniqueOrThrow({
        where: {
          id: currentBusiness.id,
        },
        select: currentBusinessSelect,
      });

      return {
        kind: "updated",
        business: updatedBusiness,
      };
    });
  },
};
