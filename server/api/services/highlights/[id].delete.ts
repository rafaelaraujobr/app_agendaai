import { serviceHighlightService } from "../../../modules/services/service-highlight.service";
import { requireUserId } from "../../../utils/require-auth";

defineRouteMeta({
  openAPI: {
    tags: ["Serviços"] as string[],
    summary: "Remover item em destaque",
  },
});

export default defineEventHandler(async (event) => {
  const userId = await requireUserId(event);
  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({ statusCode: 400, message: "Destaque não informado" });
  }

  await serviceHighlightService.delete(userId, id);
  return { message: "Destaque removido" };
});
