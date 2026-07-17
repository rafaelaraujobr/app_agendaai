import { businessService } from "../../modules/business/business.service";

defineRouteMeta({
  openAPI: {
    tags: ["Negócios"] as string[],
    summary: "Consultar configurações do negócio atual",
    description:
      "Retorna o primeiro negócio com vínculo ativo do usuário autenticado.",
  },
});

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  const userId = session.secure?.userId;

  if (!userId) {
    throw createError({
      statusCode: 401,
      statusMessage: "Autenticação necessária",
    });
  }

  const business = await businessService.getCurrent(userId);

  return {
    business,
  };
});
