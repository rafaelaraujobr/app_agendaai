import { z } from "zod";
import {
  ChannelType,
  DayOfWeek,
} from "~~/prisma/generated/enums";

const nullableText = (max: number) =>
  z.string().trim().max(max).nullable();

export const businessSlugSchema = z
  .string()
  .trim()
  .min(2)
  .max(100)
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Use apenas letras minúsculas, números e hífens.",
  );

export const checkBusinessSlugSchema = z.object({
  slug: businessSlugSchema,
});

const workingHourSchema = z
  .object({
    dayOfWeek: z.enum(DayOfWeek),
    startMinutes: z.int().min(0).max(1439),
    endMinutes: z.int().min(1).max(1440),
    breakStartMinutes: z.int().min(0).max(1439).nullable(),
    breakEndMinutes: z.int().min(1).max(1440).nullable(),
    isActive: z.boolean(),
  })
  .superRefine((value, context) => {
    if (value.endMinutes <= value.startMinutes) {
      context.addIssue({
        code: "custom",
        message: "O horário final deve ser posterior ao horário inicial.",
        path: ["endMinutes"],
      });
    }

    const hasBreakStart = value.breakStartMinutes !== null;
    const hasBreakEnd = value.breakEndMinutes !== null;

    if (hasBreakStart !== hasBreakEnd) {
      context.addIssue({
        code: "custom",
        message: "Informe o início e o fim do intervalo.",
        path: ["breakStartMinutes"],
      });
      return;
    }

    if (
      value.breakStartMinutes !== null &&
      value.breakEndMinutes !== null &&
      (value.breakStartMinutes < value.startMinutes ||
        value.breakEndMinutes > value.endMinutes ||
        value.breakEndMinutes <= value.breakStartMinutes)
    ) {
      context.addIssue({
        code: "custom",
        message: "O intervalo deve estar dentro do horário de funcionamento.",
        path: ["breakEndMinutes"],
      });
    }
  });

export const createBusinessSchema = z
  .object({
    business: z.object({
      name: z.string().trim().min(2).max(150),
      slug: businessSlugSchema,
      description: nullableText(2000),
      businessTypeSlug: z
        .string()
        .trim()
        .min(1)
        .max(100)
        .nullable(),
      logoUrl: nullableText(2048).optional().default(null),
      phone: nullableText(30),
    }),
    businessLayout: z.object({
      primaryColor: z.string().trim().min(4).max(20),
      secondaryColor: z.string().trim().min(4).max(20),
      theme: z.string().trim().min(1).max(50),
      settings: z.object({
        fontFamily: z.string().trim().min(1).max(100),
      }),
    }),
    businessChannels: z
      .array(
        z.object({
          type: z.enum(ChannelType),
          channel: z.string().trim().min(1).max(255),
        }),
      )
      .max(Object.keys(ChannelType).length),
    businessAddress: z.object({
      address: z.string().trim().min(2).max(255),
      number: nullableText(30),
      complement: nullableText(150),
      neighborhood: nullableText(150),
      city: z.string().trim().min(2).max(150),
      state: z.string().trim().min(2).max(50),
      zip: nullableText(20),
      country: z.string().trim().min(2).max(100),
      latitude: z.number().min(-90).max(90).nullable(),
      longitude: z.number().min(-180).max(180).nullable(),
    }),
    businessWorkingHours: z
      .array(workingHourSchema)
      .min(1)
      .max(Object.keys(DayOfWeek).length),
  })
  .superRefine((value, context) => {
    const channelTypes = value.businessChannels.map((channel) => channel.type);
    if (new Set(channelTypes).size !== channelTypes.length) {
      context.addIssue({
        code: "custom",
        message: "Não é permitido repetir o mesmo tipo de canal.",
        path: ["businessChannels"],
      });
    }

    const days = value.businessWorkingHours.map((hour) => hour.dayOfWeek);
    if (new Set(days).size !== days.length) {
      context.addIssue({
        code: "custom",
        message: "Não é permitido repetir o mesmo dia da semana.",
        path: ["businessWorkingHours"],
      });
    }

    if (!value.businessWorkingHours.some((hour) => hour.isActive)) {
      context.addIssue({
        code: "custom",
        message: "Ative pelo menos um dia de funcionamento.",
        path: ["businessWorkingHours"],
      });
    }
  });

export type CreateBusinessSchema = z.infer<typeof createBusinessSchema>;

export const updateCurrentBusinessSchema = createBusinessSchema;

export type UpdateCurrentBusinessSchema = z.infer<
  typeof updateCurrentBusinessSchema
>;
