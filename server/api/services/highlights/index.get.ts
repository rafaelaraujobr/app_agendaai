import { serviceHighlightService } from "../../../modules/services/service-highlight.service";
import { requireUserId } from "../../../utils/require-auth";

defineRouteMeta({
  openAPI: {
    tags: ["Serviços"] as string[],
    summary: "Listar itens em destaque",
  },
});

export default defineEventHandler(async (event) => {
  const userId = await requireUserId(event);
  return {
    highlights: await serviceHighlightService.list(userId),
    maxHighlights: 5,
  };
});
