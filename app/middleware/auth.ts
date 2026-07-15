export default defineNuxtRouteMiddleware(() => {
  const { loggedIn, user } = useUserSession();
  if (!loggedIn.value) {
    return navigateTo("/auth/login");
  } else {
    const businessSlug = user.value?.business?.slug;
    if (!businessSlug) navigateTo("/onboarding");
  }
});
