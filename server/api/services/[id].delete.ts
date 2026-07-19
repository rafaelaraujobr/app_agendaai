import { z } from "zod";
import { serviceIdSchema } from "../../modules/services/service.schema";
import { serviceService } from "../../modules/services/service.service";
import { requireUserId } from "../../utils/require-auth";

defineRouteMeta({
  openAPI: {
    tags: ["Serviços"] as string[],
    summary: "Excluir serviço",
    description:
      "Exclui um serviço sem agendamentos do negócio atual. Serviços com histórico devem ser desativados.",
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

  await serviceService.delete(userId, result.data.id);
  setResponseStatus(event, 204);
});
