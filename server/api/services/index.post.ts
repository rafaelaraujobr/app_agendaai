import { z } from "zod";
import { createServiceSchema } from "../../modules/services/service.schema";
import { serviceService } from "../../modules/services/service.service";
import { requireUserId } from "../../utils/require-auth";

defineRouteMeta({
  openAPI: {
    tags: ["Serviços"] as string[],
    summary: "Criar serviço",
    description:
      "Cria um serviço no negócio atual respeitando o limite do plano.",
    requestBody: {
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["name", "slug", "durationMinutes", "price"],
          },
        },
      },
    },
  },
});

export default defineEventHandler(async (event) => {
  const userId = await requireUserId(event);
  const result = createServiceSchema.safeParse(await readBody(event));

  if (!result.success) {
    throw createError({
      statusCode: 422,
      message: "Dados do serviço inválidos",
      data: z.flattenError(result.error),
    });
  }

  const service = await serviceService.create(userId, result.data);
  setResponseStatus(event, 201);

  return {
    message: "Serviço criado com sucesso",
    service,
  };
});
