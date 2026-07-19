import { serviceService } from "../../modules/services/service.service";
import { requireUserId } from "../../utils/require-auth";

defineRouteMeta({
  openAPI: {
    tags: ["Serviços"] as string[],
    summary: "Listar ilustrações de serviços",
    description:
      "Lista as imagens automáticas disponíveis para o tipo do negócio atual.",
  },
});

export default defineEventHandler(async (event) => {
  const userId = await requireUserId(event);

  return {
    illustrations: await serviceService.listIllustrations(userId),
  };
});
