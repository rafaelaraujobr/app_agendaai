import { z } from "zod";
import { getPublicBusinessSchema } from "../../../modules/business/business.schema";
import { businessService } from "../../../modules/business/business.service";

defineRouteMeta({
  openAPI: {
    tags: ["Negócios"] as string[],
    summary: "Consultar negócio público pelo slug",
    description:
      "Retorna os dados públicos de um negócio, incluindo identidade visual, endereço, canais, horários e serviços.",
    parameters: [
      {
        in: "path",
        name: "slug",
        required: true,
        schema: {
          type: "string",
          example: "barbearia-do-joao",
        },
      },
    ],
  },
});

export default defineEventHandler(async (event) => {
  const result = getPublicBusinessSchema.safeParse({
    slug: getRouterParam(event, "slug"),
  });

  if (!result.success) {
    throw createError({
      statusCode: 422,
      message: "Slug inválido",
      data: z.flattenError(result.error),
    });
  }

  const business = await businessService.getPublicBySlug(result.data.slug);

  return {
    business,
  };
});
