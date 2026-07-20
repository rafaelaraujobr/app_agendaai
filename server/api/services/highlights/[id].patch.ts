import { z } from "zod";
import { updateServiceHighlightSchema } from "../../../modules/services/service-highlight.schema";
import { serviceHighlightService } from "../../../modules/services/service-highlight.service";
import { requireUserId } from "../../../utils/require-auth";

defineRouteMeta({
  openAPI: {
    tags: ["Serviços"] as string[],
    summary: "Atualizar item em destaque",
  },
});

export default defineEventHandler(async (event) => {
  const userId = await requireUserId(event);
  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({ statusCode: 400, message: "Destaque não informado" });
  }

  const result = updateServiceHighlightSchema.safeParse(await readBody(event));
  if (!result.success) {
    throw createError({
      statusCode: 422,
      message: "Dados do destaque inválidos",
      data: z.flattenError(result.error),
    });
  }

  return {
    highlight: await serviceHighlightService.update(userId, id, result.data),
  };
});
