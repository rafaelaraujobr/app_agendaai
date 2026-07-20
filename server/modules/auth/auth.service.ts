// server/modules/auth/services/auth.service.ts

import bcrypt from "bcryptjs";
import { userRepository } from "../users/user.repository";
import type {
  LoginSchema,
  RegisterSchema,
  LoginWithGoogleSchema,
} from "./auth.schema.ts";
import { AuthProvider } from "~~/prisma/generated/enums";
import { mapSessionUser } from "./session-user.mapper";

const SALT_ROUNDS = 12;

export const authService = {
  async register(payload: RegisterSchema) {
    const userExists = await userRepository.findByEmail(payload.email);

    if (userExists) {
      throw createError({
        statusCode: 409,
        statusMessage: "E-mail já cadastrado",
      });
    }

    const passwordHash = await bcrypt.hash(payload.password, SALT_ROUNDS);
    const user = await userRepository.create({
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      passwordHash,
      preferences: {
        create: {},
      },
    });

    return user;
  },

  async login(payload: LoginSchema) {
    const user = await userRepository.findByEmail(payload.email);

    if (!user || !user.passwordHash) {
      throw createError({
        statusCode: 401,
        statusMessage: "E-mail ou senha inválidos",
      });
    }

    const passwordIsValid = await bcrypt.compare(
      payload.password,
      user.passwordHash,
    );

    if (!passwordIsValid) {
      throw createError({
        statusCode: 401,
        statusMessage: "E-mail ou senha inválidos",
      });
    }

    return mapSessionUser(user);
  },

  async loginWithGoogle(input: LoginWithGoogleSchema) {
    const userByGoogleId = await userRepository.findByOAuthAccount(
      AuthProvider.GOOGLE,
      input.googleId,
    );
    if (userByGoogleId) {
      return mapSessionUser(userByGoogleId);
    }

    const userByEmail = await userRepository.findByEmail(input.email);

    if (userByEmail) {
      const updatedUser = await userRepository.update(userByEmail.id, {
        email: input.email,
        firstName: userByEmail.firstName || input.firstName,
        lastName: userByEmail.lastName || input.lastName,
        avatarUrl: input.avatarUrl,
        authAccounts: {
          connectOrCreate: {
            where: {
              provider_providerAccountId: {
                provider: AuthProvider.GOOGLE,
                providerAccountId: input.googleId,
              },
            },
            create: {
              provider: AuthProvider.GOOGLE,
              providerAccountId: input.googleId,
              providerEmail: input.email,
            },
          },
        },
      });

      return mapSessionUser(updatedUser);
    }

    const createdUser = await userRepository.create({
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      avatarUrl: input.avatarUrl,
      emailVerifiedAt: new Date(),
      authAccounts: {
        create: {
          provider: AuthProvider.GOOGLE,
          providerAccountId: input.googleId,
          providerEmail: input.email,
        },
      },
      preferences: {
        create: {},
      },
    });

    return mapSessionUser(createdUser);
  },
};
