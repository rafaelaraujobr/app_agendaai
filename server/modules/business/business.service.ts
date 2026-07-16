import {
  businessRepository,
  type CurrentBusiness,
  type PublicBusiness,
} from "./business.repository";
import type {
  CreateBusinessSchema,
  UpdateCurrentBusinessSchema,
} from "./business.schema";
import { Prisma } from "~~/prisma/generated/client";

const formatCurrentBusiness = (business: CurrentBusiness) => ({
  id: business.id,
  name: business.name,
  slug: business.slug,
  description: business.description,
  logoUrl: business.logoUrl,
  phone: business.phone,
  businessType: business.businessType,
  businessLayout: business.businessLayout,
  businessChannels: business.businessChannels,
  businessAddress: business.businessAddresses
    ? {
        ...business.businessAddresses,
        latitude:
          business.businessAddresses.latitude === null
            ? null
            : Number(business.businessAddresses.latitude),
        longitude:
          business.businessAddresses.longitude === null
            ? null
            : Number(business.businessAddresses.longitude),
      }
    : null,
  businessWorkingHours: business.businessWorkingHours,
});

const formatPublicBusiness = (business: PublicBusiness) => ({
  id: business.id,
  name: business.name,
  slug: business.slug,
  description: business.description,
  logoUrl: business.logoUrl,
  bannerUrl: business.bannerUrl,
  phone: business.phone,
  businessType: business.businessType,
  businessLayout: business.businessLayout,
  businessChannels: business.businessChannels,
  businessAddress: business.businessAddresses
    ? {
        ...business.businessAddresses,
        latitude:
          business.businessAddresses.latitude === null
            ? null
            : Number(business.businessAddresses.latitude),
        longitude:
          business.businessAddresses.longitude === null
            ? null
            : Number(business.businessAddresses.longitude),
      }
    : null,
  businessWorkingHours: business.businessWorkingHours,
  services: business.services.map((service) => ({
    ...service,
    price: Number(service.price),
  })),
});

export const businessService = {
  async listBusinessTypes() {
    return await businessRepository.findBusinessTypes();
  },

  async isSlugAvailable(slug: string) {
    const business = await businessRepository.findBySlug(slug);
    return business === null;
  },

  async getPublicBySlug(slug: string) {
    const business = await businessRepository.findPublicBySlug(slug);

    if (!business) {
      throw createError({
        statusCode: 404,
        statusMessage: "Negócio não encontrado",
      });
    }

    return formatPublicBusiness(business);
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

  async getCurrent(userId: string) {
    const business = await businessRepository.findCurrentByUserId(userId);

    if (!business) {
      throw createError({
        statusCode: 404,
        statusMessage: "Nenhum negócio ativo encontrado",
      });
    }

    return formatCurrentBusiness(business);
  },

  async updateCurrent(userId: string, payload: UpdateCurrentBusinessSchema) {
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

    try {
      const result = await businessRepository.updateCurrentComplete({
        userId,
        businessTypeId,
        payload,
      });

      if (result.kind === "not_found") {
        throw createError({
          statusCode: 404,
          statusMessage: "Nenhum negócio ativo encontrado",
        });
      }

      if (result.kind === "forbidden") {
        throw createError({
          statusCode: 403,
          statusMessage:
            "Apenas o proprietário pode atualizar as configurações do negócio",
        });
      }

      if (result.kind === "slug_conflict") {
        throw createError({
          statusCode: 409,
          statusMessage: "Este slug já pertence a outro negócio",
        });
      }

      return formatCurrentBusiness(result.business);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw createError({
          statusCode: 409,
          statusMessage: "Este slug já pertence a outro negócio",
        });
      }

      throw error;
    }
  },
};
