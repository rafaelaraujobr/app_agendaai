import { z } from "zod";
import { listServicesSchema } from "../../modules/services/service.schema";
import { serviceService } from "../../modules/services/service.service";
import { requireUserId } from "../../utils/require-auth";

defineRouteMeta({
  openAPI: {
    tags: ["Serviços"] as string[],
    summary: "Listar serviços",
    description:
      "Lista os serviços do negócio atual com paginação, filtros e ordenação.",
    parameters: [
      { in: "query", name: "page", schema: { type: "integer", default: 1 } },
      {
        in: "query",
        name: "pageSize",
        schema: { type: "integer", default: 10, maximum: 100 },
      },
      { in: "query", name: "search", schema: { type: "string" } },
      {
        in: "query",
        name: "status",
        schema: { type: "string", enum: ["all", "active", "inactive"] },
      },
      {
        in: "query",
        name: "sortBy",
        schema: {
          type: "string",
          enum: ["position", "name", "price", "createdAt"],
        },
      },
      {
        in: "query",
        name: "sortOrder",
        schema: { type: "string", enum: ["asc", "desc"] },
      },
    ],
  },
});

export default defineEventHandler(async (event) => {
  const userId = await requireUserId(event);
  const result = listServicesSchema.safeParse(getQuery(event));

  if (!result.success) {
    throw createError({
      statusCode: 422,
      message: "Filtros de serviços inválidos",
      data: z.flattenError(result.error),
    });
  }

  return await serviceService.list(userId, result.data);
});
