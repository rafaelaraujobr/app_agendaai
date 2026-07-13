import { businessService } from "../../modules/business/business.service";

defineRouteMeta({
  openAPI: {
    tags: ["Negócios"] as string[],
    summary: "Listar tipos de negócio",
    description: "Retorna os tipos de negócio cadastrados.",
  },
});

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);

  if (!session.secure?.userId) {
    throw createError({
      statusCode: 401,
      statusMessage: "Autenticação necessária",
    });
  }

  const businessTypes = await businessService.listBusinessTypes();

  return {
    businessTypes,
  };
});
