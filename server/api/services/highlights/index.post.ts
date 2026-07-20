import { z } from "zod";
import { createServiceHighlightSchema } from "../../../modules/services/service-highlight.schema";
import { serviceHighlightService } from "../../../modules/services/service-highlight.service";
import { requireUserId } from "../../../utils/require-auth";

defineRouteMeta({
  openAPI: {
    tags: ["Serviços"] as string[],
    summary: "Adicionar item em destaque",
  },
});

export default defineEventHandler(async (event) => {
  const userId = await requireUserId(event);
  const result = createServiceHighlightSchema.safeParse(await readBody(event));
  if (!result.success) {
    throw createError({
      statusCode: 422,
      message: "Dados do destaque inválidos",
      data: z.flattenError(result.error),
    });
  }

  return {
    highlight: await serviceHighlightService.create(userId, result.data),
  };
});
