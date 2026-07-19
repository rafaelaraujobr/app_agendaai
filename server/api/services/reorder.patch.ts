import { z } from "zod";
import { reorderServicesSchema } from "../../modules/services/service.schema";
import { serviceService } from "../../modules/services/service.service";
import { requireUserId } from "../../utils/require-auth";

defineRouteMeta({
  openAPI: {
    tags: ["Serviços"] as string[],
    summary: "Reordenar serviços",
    description:
      "Atualiza a posição de serviços pertencentes ao negócio atual.",
    requestBody: {
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["items"],
            properties: {
              items: {
                type: "array",
                items: {
                  type: "object",
                  required: ["id", "position"],
                },
              },
            },
          },
        },
      },
    },
  },
});

export default defineEventHandler(async (event) => {
  const userId = await requireUserId(event);
  const result = reorderServicesSchema.safeParse(await readBody(event));

  if (!result.success) {
    throw createError({
      statusCode: 422,
      message: "Ordenação de serviços inválida",
      data: z.flattenError(result.error),
    });
  }

  await serviceService.reorder(userId, result.data);

  return {
    message: "Ordem dos serviços atualizada",
  };
});
