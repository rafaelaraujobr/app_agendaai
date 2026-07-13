import {
  v2 as cloudinary,
  type UploadApiResponse,
} from "cloudinary";

type UploadImageInput = {
  data: Buffer;
  folder?: string;
};

const configureCloudinary = () => {
  const config = useRuntimeConfig();
  const { cloudName, apiKey, apiSecret } = config.cloudinary;

  if (!cloudName || !apiKey || !apiSecret) {
    throw createError({
      statusCode: 500,
      statusMessage: "Cloudinary não configurada",
    });
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
};

export const uploadsService = {
  async uploadImage({
    data,
    folder = "agendaai",
  }: UploadImageInput): Promise<UploadApiResponse> {
    configureCloudinary();

    return await new Promise<UploadApiResponse>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "image",
          folder,
          allowed_formats: ["jpg", "jpeg", "png", "webp"],
          unique_filename: true,
          overwrite: false,
        },
        (error, result) => {
          if (error) {
            console.error("Erro retornado pela Cloudinary:", {
              message: error.message,
              httpCode: error.http_code,
              name: error.name,
            });

            reject(
              createError({
                statusCode: 502,
                statusMessage:
                  import.meta.dev && error.message
                    ? `Falha na Cloudinary: ${error.message}`
                    : "Falha ao enviar imagem para a Cloudinary",
                cause: error,
              }),
            );
            return;
          }

          if (!result) {
            reject(
              createError({
                statusCode: 502,
                statusMessage: "A Cloudinary não retornou o upload",
              }),
            );
            return;
          }

          resolve(result);
        },
      );

      stream.end(data);
    });
  },
};
