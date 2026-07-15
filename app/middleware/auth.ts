export default defineNuxtRouteMiddleware((to) => {
  const { loggedIn, user } = useUserSession();

  if (!loggedIn.value) {
    if (to.path !== "/auth/login") return navigateTo("/auth/login");
    return;
  }

  const businessSlug = user.value?.business?.slug;

  if (!businessSlug) {
    if (to.path !== "/onboarding") return navigateTo("/onboarding");
    return;
  }

  if (to.path === "/onboarding") return navigateTo("/");
});
