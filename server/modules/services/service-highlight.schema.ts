import { z } from "zod";

const nullableText = (max: number) =>
  z.string().trim().max(max).nullable();

const highlightBaseSchema = z.object({
  serviceId: z.string().trim().min(1),
  title: z.string().trim().min(2).max(150),
  description: nullableText(500),
  imageUrl: z.string().trim().url().max(2048).nullable(),
  isActive: z.boolean(),
  startsAt: z.iso.datetime().nullable(),
  endsAt: z.iso.datetime().nullable(),
});

const validatePeriod = (
  value: { startsAt?: string | null; endsAt?: string | null },
  context: z.RefinementCtx,
) => {
  if (
    value.startsAt &&
    value.endsAt &&
    new Date(value.endsAt) <= new Date(value.startsAt)
  ) {
    context.addIssue({
      code: "custom",
      message: "A data final deve ser posterior à data inicial.",
      path: ["endsAt"],
    });
  }
};

export const createServiceHighlightSchema = highlightBaseSchema
  .extend({
    description: nullableText(500).default(null),
    imageUrl: z.string().trim().url().max(2048).nullable().default(null),
    isActive: z.boolean().default(true),
    startsAt: z.iso.datetime().nullable().default(null),
    endsAt: z.iso.datetime().nullable().default(null),
  })
  .superRefine(validatePeriod);

export const updateServiceHighlightSchema = highlightBaseSchema
  .partial()
  .superRefine(validatePeriod)
  .refine((value) => Object.keys(value).length > 0, {
    message: "Informe pelo menos um campo para atualização.",
  });

export const reorderServiceHighlightsSchema = z.object({
  items: z
    .array(
      z.object({
        id: z.string().trim().min(1),
        position: z.number().int().min(0).max(4),
      }),
    )
    .min(1)
    .max(5)
    .refine(
      (items) => new Set(items.map((item) => item.id)).size === items.length,
      "Não é permitido repetir destaques.",
    )
    .refine(
      (items) =>
        new Set(items.map((item) => item.position)).size === items.length,
      "Não é permitido repetir posições.",
    ),
});

export type CreateServiceHighlightSchema = z.infer<
  typeof createServiceHighlightSchema
>;
export type UpdateServiceHighlightSchema = z.infer<
  typeof updateServiceHighlightSchema
>;
export type ReorderServiceHighlightsSchema = z.infer<
  typeof reorderServiceHighlightsSchema
>;
