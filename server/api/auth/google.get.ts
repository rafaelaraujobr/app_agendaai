import { authService } from "../../modules/auth/auth.service";
import { loginWithGoogleSchema } from "../../modules/auth/auth.schema";

export default defineOAuthGoogleEventHandler({
  async onSuccess(event, { user }) {
    const payload = loginWithGoogleSchema.parse({
      googleId: user.sub,
      email: user.email,
      firstName: user.given_name || user.name || user.email.split("@")[0],
      lastName: user.family_name,
      avatarUrl: user.picture,
    });
    const appUser = await authService.loginWithGoogle(payload);

    await setUserSession(event, {
      user: {
        id: appUser.id,
        firstName: appUser.firstName ?? "",
        lastName: appUser.lastName ?? "",
        email: appUser.email,
        avatarUrl: appUser.avatarUrl ?? "",
        preferences: appUser.preferences ?? {},
      },
      secure: {
        userId: appUser.id,
      },
      loggedInAt: Date.now(),
    });

    return sendRedirect(event, "/");
  },

  onError(event) {
    return sendRedirect(event, "/auth/login?error=google_oauth");
  },
});
