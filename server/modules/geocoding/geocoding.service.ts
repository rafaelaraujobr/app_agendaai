import type { GeocodeAddressSchema } from "./geocoding.schema";

type GeoapifyResult = {
  lat: number;
  lon: number;
  formatted?: string;
  housenumber?: string;
  result_type?: string;
  rank?: {
    confidence?: number;
    confidence_building_level?: number;
    match_type?: string;
  };
};

type GeoapifyResponse = {
  results?: GeoapifyResult[];
};

const normalizeHouseNumber = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]/g, "");

export const geocodingService = {
  async geocodeAddress(address: GeocodeAddressSchema) {
    const config = useRuntimeConfig();
    const apiKey = config.geoapify.apiKey;

    if (!apiKey) {
      throw createError({
        statusCode: 500,
        statusMessage: "Geoapify não configurada",
      });
    }

    let response: GeoapifyResponse;

    try {
      response = await $fetch<GeoapifyResponse>(
        "https://api.geoapify.com/v1/geocode/search",
        {
          query: {
            housenumber: address.number || undefined,
            street: address.street,
            postcode: address.zipCode.replace(/\D/g, ""),
            city: address.city,
            state: address.state,
            country: address.country,
            lang: "pt",
            limit: 1,
            format: "json",
            filter: "countrycode:br",
            apiKey,
          },
        },
      );
    } catch {
      console.error("Falha ao consultar a Geoapify");
      throw createError({
        statusCode: 502,
        statusMessage: "Não foi possível consultar a localização do endereço",
      });
    }

    const result = response.results?.[0];
    if (!result || !Number.isFinite(result.lat) || !Number.isFinite(result.lon)) {
      throw createError({
        statusCode: 404,
        statusMessage: "Localização não encontrada para o endereço informado",
      });
    }

    const requestedNumber = normalizeHouseNumber(address.number);
    const returnedNumber = normalizeHouseNumber(result.housenumber ?? "");
    const numberMatches =
      !requestedNumber || requestedNumber === returnedNumber;
    const exact =
      numberMatches &&
      result.rank?.match_type === "full_match" &&
      ["building", "amenity"].includes(result.result_type ?? "");

    return {
      latitude: result.lat,
      longitude: result.lon,
      formattedAddress: result.formatted ?? null,
      exact,
      confidence: result.rank?.confidence ?? null,
      buildingConfidence: result.rank?.confidence_building_level ?? null,
      matchType: result.rank?.match_type ?? null,
      resultType: result.result_type ?? null,
    };
  },
};
