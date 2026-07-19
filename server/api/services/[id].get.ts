import { z } from "zod";
import { serviceIdSchema } from "../../modules/services/service.schema";
import { serviceService } from "../../modules/services/service.service";
import { requireUserId } from "../../utils/require-auth";

defineRouteMeta({
  openAPI: {
    tags: ["Serviços"] as string[],
    summary: "Consultar serviço",
    description: "Retorna um serviço do negócio atual.",
    parameters: [
      {
        in: "path",
        name: "id",
        required: true,
        schema: { type: "string" },
      },
    ],
  },
});

export default defineEventHandler(async (event) => {
  const userId = await requireUserId(event);
  const result = serviceIdSchema.safeParse({
    id: getRouterParam(event, "id"),
  });

  if (!result.success) {
    throw createError({
      statusCode: 422,
      message: "Identificador do serviço inválido",
      data: z.flattenError(result.error),
    });
  }

  return {
    service: await serviceService.getById(userId, result.data.id),
  };
});
