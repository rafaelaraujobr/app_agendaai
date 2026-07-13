import { uploadsService } from "../../modules/uploads/uploads.service";

defineRouteMeta({
  openAPI: {
    tags: ["Uploads"] as string[],
    summary: "Upload de imagem",
    description: "Upload de imagem para o negócio.",
    requestBody: {
      content: {
        "multipart/form-data": {
          schema: {
            type: "object",
            required: ["file"],
            properties: {
              file: {
                type: "string",
                format: "binary",
              },
            },
          },
        },
      },
    },
  },
});

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  const userId = session.secure?.userId;

  if (!userId) {
    throw createError({
      statusCode: 401,
      statusMessage: "Autenticação necessária",
    });
  }

  const formData = await readMultipartFormData(event);
  const file = formData?.find((field) => field.name === "file");

  if (!file?.filename || !file.data.length) {
    throw createError({
      statusCode: 400,
      statusMessage: "Envie uma imagem no campo file",
    });
  }

  if (!file.type || !ACCEPTED_IMAGE_TYPES.has(file.type)) {
    throw createError({
      statusCode: 415,
      statusMessage: "Formato inválido. Use PNG, JPG, JPEG ou WEBP",
    });
  }

  if (file.data.length > MAX_FILE_SIZE) {
    throw createError({
      statusCode: 413,
      statusMessage: "A imagem deve ter no máximo 5 MB",
    });
  }

  const result = await uploadsService.uploadImage({
    data: file.data,
    folder: "agendaai/business-logos",
  });

  setResponseStatus(event, 201);

  return {
    message: "Imagem enviada com sucesso",
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
    format: result.format,
    bytes: result.bytes,
  };
});
