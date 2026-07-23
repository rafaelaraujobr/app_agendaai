import { prisma } from "../../utils/db";
import type {
  CreateServiceSchema,
  ListServicesSchema,
  ReorderServicesSchema,
  UpdateServiceSchema,
} from "./service.schema";
import type { Prisma } from "~~/prisma/generated/client";
import { MemberStatus } from "~~/prisma/generated/enums";

const managedServiceSelect = {
  id: true,
  name: true,
  slug: true,
  description: true,
  imageUrl: true,
  illustrationId: true,
  durationMinutes: true,
  price: true,
  isActive: true,
  position: true,
  createdAt: true,
  updatedAt: true,
  illustration: {
    select: {
      id: true,
      title: true,
      imageUrl: true,
    },
  },
  _count: {
    select: {
      appointments: true,
    },
  },
  serviceHighlights: {
    select: {
      id: true,
      title: true,
      description: true,
      imageUrl: true,
      position: true,
      isActive: true,
      startsAt: true,
      endsAt: true,
    },
    take: 1,
    orderBy: {
      createdAt: "asc",
    },
  },
} satisfies Prisma.ServiceSelect;

export type ManagedService = Prisma.ServiceGetPayload<{
  select: typeof managedServiceSelect;
}>;

export const serviceRepository = {
  findManagementContext: async (userId: string) => {
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
      select: {
        id: true,
        businessTypeId: true,
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
        businessSubscription: {
          select: {
            plan: {
              select: {
                code: true,
                name: true,
                maxServices: true,
              },
            },
          },
        },
      },
    });
  },

  list: async (businessId: string, filters: ListServicesSchema) => {
    const where: Prisma.ServiceWhereInput = {
      businessId,
      ...(filters.search
        ? {
            OR: [
              { name: { contains: filters.search, mode: "insensitive" } },
              { description: { contains: filters.search, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(filters.status === "active"
        ? { isActive: true }
        : filters.status === "inactive"
          ? { isActive: false }
          : {}),
    };

    const orderBy: Prisma.ServiceOrderByWithRelationInput = {
      [filters.sortBy]: filters.sortOrder,
    };

    const [services, total, activeCount, totalCount] = await prisma.$transaction([
      prisma.service.findMany({
        where,
        select: managedServiceSelect,
        orderBy: [orderBy, { name: "asc" }],
        skip: (filters.page - 1) * filters.pageSize,
        take: filters.pageSize,
      }),
      prisma.service.count({ where }),
      prisma.service.count({ where: { businessId, isActive: true } }),
      prisma.service.count({ where: { businessId } }),
    ]);

    return { services, total, activeCount, totalCount };
  },

  findById: async (businessId: string, id: string) => {
    return await prisma.service.findFirst({
      where: { id, businessId },
      select: managedServiceSelect,
    });
  },

  findBySlug: async (businessId: string, slug: string) => {
    return await prisma.service.findUnique({
      where: {
        businessId_slug: { businessId, slug },
      },
      select: { id: true },
    });
  },

  findIllustration: async (
    illustrationId: string,
    businessTypeId: string | null,
  ) => {
    return await prisma.serviceIllustration.findFirst({
      where: {
        id: illustrationId,
        isActive: true,
        OR: [{ businessTypeId }, { businessTypeId: null }],
      },
      select: { id: true },
    });
  },

  findDefaultIllustration: async (businessTypeId: string | null) => {
    return await prisma.serviceIllustration.findFirst({
      where: {
        isActive: true,
        OR: [{ businessTypeId }, { businessTypeId: null }],
      },
      orderBy: [{ businessTypeId: "desc" }, { title: "asc" }],
      select: { id: true },
    });
  },

  listIllustrations: async (businessTypeId: string | null) => {
    return await prisma.serviceIllustration.findMany({
      where: {
        isActive: true,
        OR: [{ businessTypeId }, { businessTypeId: null }],
      },
      orderBy: [{ businessTypeId: "desc" }, { title: "asc" }],
      select: {
        id: true,
        title: true,
        imageUrl: true,
      },
    });
  },

  countAll: async (businessId: string) => {
    return await prisma.service.count({ where: { businessId } });
  },

  getNextPosition: async (businessId: string) => {
    const aggregate = await prisma.service.aggregate({
      where: { businessId },
      _max: { position: true },
    });
    return (aggregate._max.position ?? -1) + 1;
  },

  create: async (
    businessId: string,
    payload: CreateServiceSchema,
    illustrationId: string | null,
    position: number,
  ) => {
    return await prisma.service.create({
      data: {
        businessId,
        name: payload.name,
        slug: payload.slug,
        description: payload.description,
        imageUrl: payload.imageUrl,
        illustrationId,
        durationMinutes: payload.durationMinutes,
        price: payload.price,
        isActive: payload.isActive,
        position,
      },
      select: managedServiceSelect,
    });
  },

  update: async (
    id: string,
    payload: UpdateServiceSchema,
    imageSelection?: {
      imageUrl: string | null;
      illustrationId: string | null;
    },
  ) => {
    return await prisma.service.update({
      where: { id },
      data: {
        ...payload,
        ...imageSelection,
      },
      select: managedServiceSelect,
    });
  },

  reorder: async (
    businessId: string,
    items: ReorderServicesSchema["items"],
  ) => {
    return await prisma.$transaction(async (transaction) => {
      const ownedCount = await transaction.service.count({
        where: {
          businessId,
          id: { in: items.map((item) => item.id) },
        },
      });

      if (ownedCount !== items.length) return false;

      await Promise.all(
        items.map((item) =>
          transaction.service.update({
            where: { id: item.id },
            data: { position: item.position },
          }),
        ),
      );

      return true;
    });
  },

  delete: async (id: string) => {
    return await prisma.service.delete({
      where: { id },
      select: { id: true },
    });
  },
};
