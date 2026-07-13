import { prisma } from "../../utils/db";
import type { Prisma } from "~~/prisma/generated/client";
import { AuthProvider } from "~~/prisma/generated/enums";
import type {
  UserCreateInput,
  UserUpdateInput,
} from "~~/prisma/generated/models/User";

const userWithRelations = {
  preferences: true,
  businessMembers: {
    take: 1,
    orderBy: {
      createdAt: "asc",
    },
    include: {
      business: {
        select: {
          id: true,
          name: true,
          slug: true,
          businessType: {
            select: {
              id: true,
              name: true,
            },
          },
          businessChannels: {
            select: {
              id: true,
              type: true,
              channel: true,
            },
          },
          businessWorkingHours: {
            select: {
              id: true,
              dayOfWeek: true,
              startMinutes: true,
              endMinutes: true,
            },
          },
          businessLayout: {
            select: {
              id: true,
              primaryColor: true,
              secondaryColor: true,
              theme: true,
            },
          },
        },
      },
    },
  },
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

  findByOAuthAccount: async (
    provider: AuthProvider,
    providerAccountId: string,
  ) => {
    const account = await prisma.oAuthAccount.findUnique({
      where: {
        provider_providerAccountId: {
          provider,
          providerAccountId,
        },
      },
      include: {
        user: {
          include: userWithRelations,
        },
      },
    });

    return account?.user ?? null;
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
