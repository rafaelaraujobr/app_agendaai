import { businessRepository } from "./business.repository";
import type { CreateBusinessSchema } from "./business.schema";
import { Prisma } from "~~/prisma/generated/client";

export const businessService = {
  async listBusinessTypes() {
    return await businessRepository.findBusinessTypes();
  },

  async isSlugAvailable(slug: string) {
    const business = await businessRepository.findBySlug(slug);
    return business === null;
  },

  async create(userId: string, payload: CreateBusinessSchema) {
    let businessTypeId: string | null = null;

    if (payload.business.businessTypeSlug) {
      const businessType = await businessRepository.findBusinessTypeBySlug(
        payload.business.businessTypeSlug,
      );

      if (!businessType) {
        throw createError({
          statusCode: 422,
          statusMessage: "Tipo de negócio não encontrado",
        });
      }

      businessTypeId = businessType.id;
    }

    const freePlan = await businessRepository.findFreePlan();

    if (!freePlan) {
      throw createError({
        statusCode: 500,
        statusMessage: "Plano gratuito não configurado",
      });
    }

    try {
      return await businessRepository.createComplete({
        userId,
        businessTypeId,
        planId: freePlan.id,
        payload,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw createError({
          statusCode: 409,
          statusMessage: "Já existe um negócio com os dados informados",
        });
      }

      throw error;
    }
  },
};
