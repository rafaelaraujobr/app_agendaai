import { z } from "zod";
import {
  serviceIdSchema,
  updateServiceSchema,
} from "../../modules/services/service.schema";
import { serviceService } from "../../modules/services/service.service";
import { requireUserId } from "../../utils/require-auth";

defineRouteMeta({
  openAPI: {
    tags: ["Serviços"] as string[],
    summary: "Atualizar serviço",
    description: "Atualiza um serviço pertencente ao negócio atual.",
    parameters: [
      {
        in: "path",
        name: "id",
        required: true,
        schema: { type: "string" },
      },
    ],
    requestBody: {
      content: {
        "application/json": {
          schema: { type: "object" },
        },
      },
    },
  },
});

export default defineEventHandler(async (event) => {
  const userId = await requireUserId(event);
  const params = serviceIdSchema.safeParse({
    id: getRouterParam(event, "id"),
  });
  const body = updateServiceSchema.safeParse(await readBody(event));

  if (!params.success || !body.success) {
    const error = params.success ? body.error : params.error;
    throw createError({
      statusCode: 422,
      message: "Dados do serviço inválidos",
      data: z.flattenError(error),
    });
  }

  return {
    message: "Serviço atualizado com sucesso",
    service: await serviceService.update(userId, params.data.id, body.data),
  };
});
