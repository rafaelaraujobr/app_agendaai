import {
  serviceHighlightRepository,
  type ManagedServiceHighlight,
} from "./service-highlight.repository";
import type {
  CreateServiceHighlightSchema,
  ReorderServiceHighlightsSchema,
  UpdateServiceHighlightSchema,
} from "./service-highlight.schema";
import { serviceRepository } from "./service.repository";
import { Prisma } from "~~/prisma/generated/client";
import { MemberRole } from "~~/prisma/generated/enums";

const MAX_HIGHLIGHTS = 5;

const formatHighlight = (highlight: ManagedServiceHighlight) => ({
  ...highlight,
  imageUrl:
    highlight.imageUrl ||
    highlight.service.imageUrl ||
    highlight.service.illustration?.imageUrl ||
    null,
});

const requireContext = async (userId: string) => {
  const context = await serviceRepository.findManagementContext(userId);
  if (!context) {
    throw createError({
      statusCode: 404,
      message: "Nenhum negócio ativo encontrado",
    });
  }
  if (context.businessMembers[0]?.role !== MemberRole.OWNER) {
    throw createError({
      statusCode: 403,
      message: "Apenas o proprietário pode gerenciar os destaques",
    });
  }
  return context;
};

const requireOwnedService = async (businessId: string, serviceId: string) => {
  const service = await serviceHighlightRepository.serviceBelongsToBusiness(
    businessId,
    serviceId,
  );
  if (!service) {
    throw createError({
      statusCode: 422,
      message: "O serviço selecionado não pertence ao negócio atual",
    });
  }
};

const handlePersistenceError = (error: unknown): never => {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  ) {
    throw createError({
      statusCode: 409,
      message: "Já existe um destaque nesta posição",
    });
  }
  throw error;
};

export const serviceHighlightService = {
  async list(userId: string) {
    const context = await requireContext(userId);
    const highlights = await serviceHighlightRepository.list(context.id);
    return highlights.map(formatHighlight);
  },

  async create(userId: string, payload: CreateServiceHighlightSchema) {
    const context = await requireContext(userId);
    const count = await serviceHighlightRepository.count(context.id);
    if (count >= MAX_HIGHLIGHTS) {
      throw createError({
        statusCode: 409,
        message: `É permitido no máximo ${MAX_HIGHLIGHTS} itens em destaque`,
      });
    }

    await requireOwnedService(context.id, payload.serviceId);
    const position =
      await serviceHighlightRepository.getAvailablePosition(context.id);

    try {
      return formatHighlight(
        await serviceHighlightRepository.create(
          context.id,
          payload,
          position,
        ),
      );
    } catch (error) {
      return handlePersistenceError(error);
    }
  },

  async update(
    userId: string,
    id: string,
    payload: UpdateServiceHighlightSchema,
  ) {
    const context = await requireContext(userId);
    const current = await serviceHighlightRepository.findById(context.id, id);
    if (!current) {
      throw createError({
        statusCode: 404,
        message: "Destaque não encontrado",
      });
    }
    if (payload.serviceId) {
      await requireOwnedService(context.id, payload.serviceId);
    }

    const startsAt =
      payload.startsAt === undefined ? current.startsAt : payload.startsAt;
    const endsAt =
      payload.endsAt === undefined ? current.endsAt : payload.endsAt;
    if (startsAt && endsAt && new Date(endsAt) <= new Date(startsAt)) {
      throw createError({
        statusCode: 422,
        message: "A data final deve ser posterior à data inicial",
      });
    }

    return formatHighlight(
      await serviceHighlightRepository.update(id, payload),
    );
  },

  async reorder(userId: string, payload: ReorderServiceHighlightsSchema) {
    const context = await requireContext(userId);
    const updated = await serviceHighlightRepository.reorder(
      context.id,
      payload.items,
    );
    if (!updated) {
      throw createError({
        statusCode: 404,
        message: "Um ou mais destaques não pertencem ao negócio atual",
      });
    }
  },

  async delete(userId: string, id: string) {
    const context = await requireContext(userId);
    const current = await serviceHighlightRepository.findById(context.id, id);
    if (!current) {
      throw createError({
        statusCode: 404,
        message: "Destaque não encontrado",
      });
    }

    await serviceHighlightRepository.delete(id);
    const remaining = await serviceHighlightRepository.list(context.id);
    if (remaining.length) {
      await serviceHighlightRepository.reorder(
        context.id,
        remaining.map((highlight, position) => ({
          id: highlight.id,
          position,
        })),
      );
    }
  },
};
