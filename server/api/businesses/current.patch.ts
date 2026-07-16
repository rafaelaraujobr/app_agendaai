import { updateCurrentBusinessSchema } from "../../modules/business/business.schema";
import { businessService } from "../../modules/business/business.service";

defineRouteMeta({
  openAPI: {
    tags: ["Negócios"] as string[],
    summary: "Atualizar configurações do negócio atual",
    description:
      "Atualiza perfil, tipo, layout, endereço, canais e horários do negócio atual.",
    requestBody: {
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: [
              "business",
              "businessLayout",
              "businessChannels",
              "businessAddress",
              "businessWorkingHours",
            ],
          },
        },
      },
    },
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

  const body = await readBody(event);
  const result = updateCurrentBusinessSchema.safeParse(body);

  if (!result.success) {
    throw createError({
      statusCode: 422,
      statusMessage: "Dados do negócio inválidos",
      data: result.error.flatten(),
    });
  }

  const business = await businessService.updateCurrent(userId, result.data);

  return {
    business,
  };
});
