defineRouteMeta({
  openAPI: {
    tags: ["Autenticação"] as string[],
    summary: "Logout de usuário",
    description: "Logout de usuário do sistema por token de autenticação",
  },
});

export default defineEventHandler(async (event) => {
  await clearUserSession(event);
});
