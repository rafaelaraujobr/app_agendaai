import { prisma } from "../../utils/db";
import type { Prisma } from "~~/prisma/generated/client";
import type {
  UserCreateInput,
  UserUpdateInput,
} from "~~/prisma/generated/models/User";

const userWithRelations = {
  preferences: true,
} as const;

type UserWithRelations = Prisma.UserGetPayload<{
  include: typeof userWithRelations;
}>;

export const userRepository = {
  findById: async (id: string): Promise<UserWithRelations | null> => {
    return await prisma.user.findUnique({
      where: { id },
      include: userWithRelations,
    });
  },


  findByEmail: async (email: string) => {
    return await prisma.user.findUnique({
      where: { email },
      include: userWithRelations,
    });
  },

  findByProviderId: async (providerId: string) => {
    return await prisma.user.findUnique({
      where: { providerId },
      include: userWithRelations,
    });
  },

  update: async (id: string, data: UserUpdateInput) => {
    return await prisma.user.update({
      where: { id },
      data,
      include: userWithRelations,
    });
  },

  create: async (data: UserCreateInput) => {
    return await prisma.user.create({
      data,
      include: userWithRelations,
    });
  },
};
