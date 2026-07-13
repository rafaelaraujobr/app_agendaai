import { checkBusinessSlugSchema } from "../../modules/business/business.schema";
import { businessService } from "../../modules/business/business.service";

defineRouteMeta({
  openAPI: {
    tags: ["Negócios"] as string[],
    summary: "Verificar disponibilidade do slug",
    description: "Verifica se um slug pode ser utilizado por um novo negócio.",
    parameters: [
      {
        in: "query",
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
  const session = await getUserSession(event);

  if (!session.secure?.userId) {
    throw createError({
      statusCode: 401,
      statusMessage: "Autenticação necessária",
    });
  }

  const result = checkBusinessSlugSchema.safeParse(getQuery(event));

  if (!result.success) {
    throw createError({
      statusCode: 422,
      statusMessage: "Slug inválido",
      data: result.error.flatten(),
    });
  }

  const available = await businessService.isSlugAvailable(result.data.slug);

  return {
    slug: result.data.slug,
    available,
  };
});
