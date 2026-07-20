import { prisma } from "../../utils/db";
import type {
  CreateServiceHighlightSchema,
  ReorderServiceHighlightsSchema,
  UpdateServiceHighlightSchema,
} from "./service-highlight.schema";
import type { Prisma } from "~~/prisma/generated/client";

const managedHighlightSelect = {
  id: true,
  serviceId: true,
  title: true,
  description: true,
  imageUrl: true,
  position: true,
  isActive: true,
  startsAt: true,
  endsAt: true,
  createdAt: true,
  updatedAt: true,
  service: {
    select: {
      id: true,
      name: true,
      imageUrl: true,
      isActive: true,
      illustration: {
        select: {
          imageUrl: true,
        },
      },
    },
  },
} satisfies Prisma.ServiceHighlightSelect;

export type ManagedServiceHighlight = Prisma.ServiceHighlightGetPayload<{
  select: typeof managedHighlightSelect;
}>;

export const serviceHighlightRepository = {
  list: async (businessId: string) =>
    await prisma.serviceHighlight.findMany({
      where: { businessId },
      select: managedHighlightSelect,
      orderBy: [{ position: "asc" }, { createdAt: "asc" }],
    }),

  count: async (businessId: string) =>
    await prisma.serviceHighlight.count({ where: { businessId } }),

  findById: async (businessId: string, id: string) =>
    await prisma.serviceHighlight.findFirst({
      where: { id, businessId },
      select: managedHighlightSelect,
    }),

  serviceBelongsToBusiness: async (businessId: string, serviceId: string) =>
    await prisma.service.findFirst({
      where: { id: serviceId, businessId },
      select: { id: true },
    }),

  getAvailablePosition: async (businessId: string) => {
    const highlights = await prisma.serviceHighlight.findMany({
      where: { businessId },
      select: { position: true },
    });
    const used = new Set(highlights.map((highlight) => highlight.position));
    return [0, 1, 2, 3, 4].find((position) => !used.has(position)) ?? 0;
  },

  create: async (
    businessId: string,
    payload: CreateServiceHighlightSchema,
    position: number,
  ) =>
    await prisma.serviceHighlight.create({
      data: {
        businessId,
        serviceId: payload.serviceId,
        title: payload.title,
        description: payload.description,
        imageUrl: payload.imageUrl,
        isActive: payload.isActive,
        startsAt: payload.startsAt ? new Date(payload.startsAt) : null,
        endsAt: payload.endsAt ? new Date(payload.endsAt) : null,
        position,
      },
      select: managedHighlightSelect,
    }),

  update: async (id: string, payload: UpdateServiceHighlightSchema) =>
    await prisma.serviceHighlight.update({
      where: { id },
      data: {
        ...payload,
        startsAt:
          payload.startsAt === undefined
            ? undefined
            : payload.startsAt
              ? new Date(payload.startsAt)
              : null,
        endsAt:
          payload.endsAt === undefined
            ? undefined
            : payload.endsAt
              ? new Date(payload.endsAt)
              : null,
      },
      select: managedHighlightSelect,
    }),

  reorder: async (
    businessId: string,
    items: ReorderServiceHighlightsSchema["items"],
  ) =>
    await prisma.$transaction(async (transaction) => {
      const count = await transaction.serviceHighlight.count({
        where: {
          businessId,
          id: { in: items.map((item) => item.id) },
        },
      });
      if (count !== items.length) return false;

      await Promise.all(
        items.map((item, index) =>
          transaction.serviceHighlight.update({
            where: { id: item.id },
            data: { position: 100 + index },
          }),
        ),
      );
      await Promise.all(
        items.map((item) =>
          transaction.serviceHighlight.update({
            where: { id: item.id },
            data: { position: item.position },
          }),
        ),
      );
      return true;
    }),

  delete: async (id: string) =>
    await prisma.serviceHighlight.delete({
      where: { id },
      select: { id: true },
    }),
};
