import { mapSessionUser } from "../../modules/auth/session-user.mapper";
import { userRepository } from "../../modules/users/user.repository";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);

  if (!session.secure?.userId) {
    return {
      loggedIn: false,
      user: null,
    };
  }

  const dbUser = await userRepository.findById(session.secure.userId);

  if (!dbUser) {
    return {
      loggedIn: false,
      user: null,
    };
  }

  const user = mapSessionUser(dbUser);

  await setUserSession(event, {
    ...session,
    user,
  });

  return {
    loggedIn: true,
    user,
  };
});
