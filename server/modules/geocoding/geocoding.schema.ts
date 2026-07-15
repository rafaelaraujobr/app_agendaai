import { z } from "zod";

const optionalAddressField = (max: number) =>
  z.string().trim().max(max).optional().default("");

export const geocodeAddressSchema = z.object({
  street: z.string().trim().min(2).max(255),
  number: optionalAddressField(30),
  neighborhood: optionalAddressField(150),
  city: z.string().trim().min(2).max(150),
  state: z.string().trim().min(2).max(50),
  zipCode: z.string().trim().min(8).max(20),
  country: z.string().trim().min(2).max(100).default("Brasil"),
});

export type GeocodeAddressSchema = z.infer<typeof geocodeAddressSchema>;
