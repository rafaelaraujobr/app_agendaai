import { serviceHighlightRepository } from "./service-highlight.repository";
import {
  serviceRepository,
  type ManagedService,
} from "./service.repository";
import type {
  CreateServiceSchema,
  ListServicesSchema,
  ReorderServicesSchema,
  UpdateServiceSchema,
} from "./service.schema";
import { Prisma } from "~~/prisma/generated/client";
import { MemberRole } from "~~/prisma/generated/enums";

type ManagementContext = NonNullable<
  Awaited<ReturnType<typeof serviceRepository.findManagementContext>>
>;

const formatServiceHighlight = (
  highlight: ManagedService["serviceHighlights"][number] | undefined,
) => {
  if (!highlight) return null;
  return {
    id: highlight.id,
    title: highlight.title,
    description: highlight.description,
    imageUrl: highlight.imageUrl,
    position: highlight.position,
    isActive: highlight.isActive,
    startsAt: highlight.startsAt?.toISOString() ?? null,
    endsAt: highlight.endsAt?.toISOString() ?? null,
  };
};

const formatService = (service: ManagedService) => {
  const { serviceHighlights, _count, ...rest } = service;
  return {
    ...rest,
    price: Number(rest.price),
    appointmentCount: _count.appointments,
    highlight: formatServiceHighlight(serviceHighlights[0]),
  };
};

const requireManagementContext = async (
  userId: string,
): Promise<ManagementContext> => {
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
      message: "Apenas o proprietário pode gerenciar serviços",
    });
  }

  return context;
};

const validateIllustration = async (
  illustrationId: string | null,
  businessTypeId: string | null,
) => {
  if (!illustrationId) return null;

  const illustration = await serviceRepository.findIllustration(
    illustrationId,
    businessTypeId,
  );

  if (!illustration) {
    throw createError({
      statusCode: 422,
      message: "A ilustração selecionada não está disponível para este negócio",
    });
  }

  return illustration.id;
};

const handlePersistenceError = (error: unknown): never => {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  ) {
    throw createError({
      statusCode: 409,
      message: "Já existe um serviço com este endereço",
    });
  }

  throw error;
};

export const serviceService = {
  async list(userId: string, filters: ListServicesSchema) {
    const context = await requireManagementContext(userId);
    const result = await serviceRepository.list(context.id, filters);
    const maxServices =
      context.businessSubscription?.plan.maxServices ?? null;
    const highlightsCount = await serviceHighlightRepository.count(context.id);

    return {
      services: result.services.map(formatService),
      pagination: {
        page: filters.page,
        pageSize: filters.pageSize,
        total: result.total,
        totalPages: Math.ceil(result.total / filters.pageSize),
      },
      summary: {
        activeCount: result.activeCount,
        totalCount: result.totalCount,
        maxServices,
        plan: context.businessSubscription?.plan.code ?? null,
        highlightsCount,
        maxHighlights: 5,
      },
    };
  },

  async getById(userId: string, id: string) {
    const context = await requireManagementContext(userId);
    const service = await serviceRepository.findById(context.id, id);

    if (!service) {
      throw createError({
        statusCode: 404,
        message: "Serviço não encontrado",
      });
    }

    return formatService(service);
  },

  async listIllustrations(userId: string) {
    const context = await requireManagementContext(userId);
    return await serviceRepository.listIllustrations(context.businessTypeId);
  },

  async create(userId: string, payload: CreateServiceSchema) {
    const context = await requireManagementContext(userId);
    const total = await serviceRepository.countAll(context.id);
    const maxServices =
      context.businessSubscription?.plan.maxServices ?? null;

    if (maxServices !== null && total >= maxServices) {
      throw createError({
        statusCode: 409,
        message: `Seu plano permite até ${maxServices} serviço(s)`,
      });
    }

    let illustrationId = await validateIllustration(
      payload.illustrationId,
      context.businessTypeId,
    );

    if (!payload.imageUrl && !illustrationId) {
      const defaultIllustration =
        await serviceRepository.findDefaultIllustration(context.businessTypeId);
      illustrationId = defaultIllustration?.id ?? null;
    }

    const position =
      payload.position ?? (await serviceRepository.getNextPosition(context.id));

    try {
      const service = await serviceRepository.create(
        context.id,
        payload,
        payload.imageUrl ? null : illustrationId,
        position,
      );
      return formatService(service);
    } catch (error) {
      return handlePersistenceError(error);
    }
  },

  async update(userId: string, id: string, payload: UpdateServiceSchema) {
    const context = await requireManagementContext(userId);
    const current = await serviceRepository.findById(context.id, id);

    if (!current) {
      throw createError({
        statusCode: 404,
        message: "Serviço não encontrado",
      });
    }

    let imageSelection:
      | { imageUrl: string | null; illustrationId: string | null }
      | undefined;

    if (payload.imageUrl !== undefined || payload.illustrationId !== undefined) {
      if (payload.imageUrl) {
        imageSelection = {
          imageUrl: payload.imageUrl,
          illustrationId: null,
        };
      } else if (payload.illustrationId) {
        const illustrationId = await validateIllustration(
          payload.illustrationId,
          context.businessTypeId,
        );
        imageSelection = { imageUrl: null, illustrationId };
      } else {
        const defaultIllustration =
          await serviceRepository.findDefaultIllustration(
            context.businessTypeId,
          );
        imageSelection = {
          imageUrl: null,
          illustrationId: defaultIllustration?.id ?? null,
        };
      }
    }

    try {
      const service = await serviceRepository.update(
        id,
        payload,
        imageSelection,
      );
      return formatService(service);
    } catch (error) {
      return handlePersistenceError(error);
    }
  },

  async reorder(userId: string, payload: ReorderServicesSchema) {
    const context = await requireManagementContext(userId);
    const updated = await serviceRepository.reorder(context.id, payload.items);

    if (!updated) {
      throw createError({
        statusCode: 404,
        message: "Um ou mais serviços não pertencem ao negócio atual",
      });
    }
  },

  async delete(userId: string, id: string) {
    const context = await requireManagementContext(userId);
    const service = await serviceRepository.findById(context.id, id);

    if (!service) {
      throw createError({
        statusCode: 404,
        message: "Serviço não encontrado",
      });
    }

    if (service._count.appointments > 0) {
      throw createError({
        statusCode: 409,
        message:
          "Este serviço possui agendamentos e não pode ser excluído. Desative-o para preservar o histórico.",
      });
    }

    await serviceRepository.delete(id);
  },
};
