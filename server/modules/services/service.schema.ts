import { z } from "zod";

export const serviceSlugSchema = z
  .string()
  .trim()
  .min(2)
  .max(100)
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Use apenas letras minúsculas, números e hífens.",
  );

const nullableText = (max: number) =>
  z.string().trim().max(max).nullable();

const serviceBaseSchema = z.object({
  name: z.string().trim().min(2).max(150),
  slug: serviceSlugSchema,
  description: nullableText(2000),
  imageUrl: z.string().trim().url().max(2048).nullable(),
  illustrationId: z.string().trim().min(1).nullable(),
  durationMinutes: z.coerce.number().int().min(5).max(1440),
  price: z.coerce.number().min(0).max(999999.99),
  isActive: z.boolean(),
  position: z.coerce.number().int().min(0).optional(),
});

const validateImageSelection = (
  value: { imageUrl?: string | null; illustrationId?: string | null },
  context: z.RefinementCtx,
) => {
  if (value.imageUrl && value.illustrationId) {
    context.addIssue({
      code: "custom",
      message: "Escolha uma imagem enviada ou uma ilustração automática.",
      path: ["imageUrl"],
    });
  }
};

export const createServiceSchema = serviceBaseSchema
  .extend({
    description: nullableText(2000).default(null),
    imageUrl: z.string().trim().url().max(2048).nullable().default(null),
    illustrationId: z.string().trim().min(1).nullable().default(null),
    isActive: z.boolean().default(true),
  })
  .superRefine(validateImageSelection);

export const updateServiceSchema = serviceBaseSchema
  .partial()
  .superRefine(validateImageSelection)
  .refine((value) => Object.keys(value).length > 0, {
    message: "Informe pelo menos um campo para atualização.",
  });

export const serviceIdSchema = z.object({
  id: z.string().trim().min(1),
});

export const listServicesSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().trim().max(100).optional(),
  status: z.enum(["all", "active", "inactive"]).default("all"),
  sortBy: z
    .enum(["position", "name", "price", "createdAt"])
    .default("position"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

export const reorderServicesSchema = z.object({
  items: z
    .array(
      z.object({
        id: z.string().trim().min(1),
        position: z.coerce.number().int().min(0),
      }),
    )
    .min(1)
    .max(100)
    .refine(
      (items) => new Set(items.map((item) => item.id)).size === items.length,
      "Não é permitido repetir serviços na ordenação.",
    ),
});

export type CreateServiceSchema = z.infer<typeof createServiceSchema>;
export type UpdateServiceSchema = z.infer<typeof updateServiceSchema>;
export type ListServicesSchema = z.infer<typeof listServicesSchema>;
export type ReorderServicesSchema = z.infer<typeof reorderServicesSchema>;
