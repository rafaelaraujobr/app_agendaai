import { authService } from "../../modules/auth/auth.service";

export default defineOAuthGoogleEventHandler({
  async onSuccess(event, { user }) {
    const appUser = await authService.loginWithGoogle({
      googleId: user.sub,
      email: user.email,
      firstName: user.given_name,
      lastName: user.family_name,
      avatarUrl: user.picture,
    });

    await setUserSession(event, {
      user: {
        id: appUser.id,
        firstName: appUser.firstName ?? "",
        lastName: appUser.lastName ?? "",
        email: appUser.email,
        avatarUrl: appUser.avatarUrl ?? "",
        preferences: appUser.preferences ?? {},
      },
      loggedInAt: Date.now(),
    });

    return sendRedirect(event, "/");
  },

  onError(event) {
    return sendRedirect(event, "/auth/login?error=google_oauth");
  },
});
