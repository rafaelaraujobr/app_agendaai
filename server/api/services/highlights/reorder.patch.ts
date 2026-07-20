import { z } from "zod";
import { reorderServiceHighlightsSchema } from "../../../modules/services/service-highlight.schema";
import { serviceHighlightService } from "../../../modules/services/service-highlight.service";
import { requireUserId } from "../../../utils/require-auth";

defineRouteMeta({
  openAPI: {
    tags: ["Serviços"] as string[],
    summary: "Reordenar itens em destaque",
  },
});

export default defineEventHandler(async (event) => {
  const userId = await requireUserId(event);
  const result = reorderServiceHighlightsSchema.safeParse(
    await readBody(event),
  );
  if (!result.success) {
    throw createError({
      statusCode: 422,
      message: "Ordenação inválida",
      data: z.flattenError(result.error),
    });
  }

  await serviceHighlightService.reorder(userId, result.data);
  return { message: "Ordem dos destaques atualizada" };
});
