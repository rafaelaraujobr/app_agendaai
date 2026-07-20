import { mapSessionUser } from "../modules/auth/session-user.mapper";
import { userRepository } from "../modules/users/user.repository";

export default defineNitroPlugin(() => {
  sessionHooks.hook("fetch", async (session) => {
    const userId = session.secure?.userId;

    if (!userId || !session.user) return;

    const user = await userRepository.findById(userId);
    if (!user) return;

    session.user = mapSessionUser(user);
  });
});
