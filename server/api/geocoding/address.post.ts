import { z } from "zod";
import { geocodeAddressSchema } from "../../modules/geocoding/geocoding.schema";
import { geocodingService } from "../../modules/geocoding/geocoding.service";

defineRouteMeta({
  openAPI: {
    tags: ["Geocodificação"] as string[],
    summary: "Localizar endereço",
    description:
      "Obtém latitude e longitude de um endereço completo usando a Geoapify.",
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

  const result = geocodeAddressSchema.safeParse(await readBody(event));
  if (!result.success) {
    throw createError({
      statusCode: 422,
      statusMessage: "Endereço inválido",
      data: z.flattenError(result.error),
    });
  }

  const location = await geocodingService.geocodeAddress(result.data);

  return { location };
});
