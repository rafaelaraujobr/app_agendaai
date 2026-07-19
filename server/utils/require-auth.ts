import type { H3Event } from "h3";

export const requireUserId = async (event: H3Event) => {
  const session = await getUserSession(event);
  const userId = session.secure?.userId;

  if (!userId) {
    throw createError({
      statusCode: 401,
      message: "Autenticação necessária",
    });
  }

  return userId;
};
