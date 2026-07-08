defineRouteMeta({
  openAPI: {
    tags: ["Autenticação"] as string[],
    summary: "Login de usuário",
    description:
      "Login de usuário no sistema por e-mail e senha e retornar token de autenticação",
    requestBody: {
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["email", "password"],
            properties: {
              email: {
                type: "string",
                format: "email",
                example: "john.doe@example.com",
              },
              password: {
                type: "string",
                format: "password",
                example: "password123",
              },
            },
          },
        },
      },
    },
  },
});

import { loginSchema } from "../../modules/auth/auth.schema";
import { authService } from "../../modules/auth/auth.service";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const payload = loginSchema.parse(body);
  const user = await authService.login(payload);
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid credentials",
    });
  }
  await setUserSession(event, {
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      avatarUrl: user.avatarUrl ?? "",
      preferences: user.preferences ?? {},
    },
    secure: {
      userId: user.id,
    },
    loggedInAt: Date.now(),
  });
  return {
    message: "Login realizado com sucesso",
  };
});
