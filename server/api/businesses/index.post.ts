import { z } from "zod";
import { createBusinessSchema } from "../../modules/business/business.schema";
import { businessService } from "../../modules/business/business.service";

defineRouteMeta({
  openAPI: {
    tags: ["Negócios"] as string[],
    summary: "Criar negócio",
    description:
      "Cria o negócio e configura proprietário, plano, endereço, canais, layout e horários.",
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
  const result = createBusinessSchema.safeParse(body);

  if (!result.success) {
    throw createError({
      statusCode: 422,
      statusMessage: "Dados do negócio inválidos",
      data: z.flattenError(result.error),
    });
  }

  const business = await businessService.create(userId, result.data);

  if (session.user) {
    await setUserSession(event, {
      ...session,
      user: {
        ...session.user,
        business,
      },
    });
  }

  setResponseStatus(event, 201);

  return {
    message: "Negócio criado com sucesso",
    business,
  };
});
