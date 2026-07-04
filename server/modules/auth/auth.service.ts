// server/modules/auth/services/auth.service.ts

import bcrypt from "bcryptjs";
import { userRepository } from "../users/user.repository";
import type {
  LoginSchema,
  RegisterSchema,
  LoginWithGoogleSchema,
} from "./auth.schema.ts";

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

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      avatarUrl: user.avatarUrl ?? "",
      preferences: user.preferences,
    };
  },

  async loginWithGoogle(input: LoginWithGoogleSchema) {
    const userByGoogleId = await userRepository.findByProviderId(
      input.googleId,
    );
    if (userByGoogleId) {
      return {
        id: userByGoogleId.id,
        firstName: userByGoogleId.firstName,
        lastName: userByGoogleId.lastName,
        email: userByGoogleId.email,
        avatarUrl: userByGoogleId.avatarUrl,
        preferences: userByGoogleId.preferences,
      };
    }

    const userByEmail = await userRepository.findByEmail(input.email);

    if (userByEmail) {
      const updatedUser = await userRepository.update(userByEmail.id, {
        provider: "google",
        providerId: input.googleId,
        email: input.email,
        firstName: userByEmail.firstName || input.firstName,
        lastName: userByEmail.lastName || input.lastName,
        avatarUrl: input.avatarUrl,
      });

      return {
        id: updatedUser.id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        avatarUrl: updatedUser.avatarUrl,
        preferences: updatedUser.preferences,
      };
    }

    const createdUser = await userRepository.create({
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      provider: "google",
      providerId: input.googleId,
      avatarUrl: input.avatarUrl,
      preferences: {
        create: {},
      },
    });

    return {
      id: createdUser.id,
      firstName: createdUser.firstName,
      lastName: createdUser.lastName,
      email: createdUser.email,
      avatarUrl: createdUser.avatarUrl,
      preferences: createdUser.preferences,
    };
  },
};
