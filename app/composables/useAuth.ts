const useAuth = () => {
  const { user, fetch } = useUserSession();

  const login = async (email: string, password: string) => {
    return $fetch("/api/auth/login", {
      method: "POST",
      body: { email, password },
    });
  };

  const loginWithGoogle = async () => {
    await navigateTo("/api/auth/google", { external: true });
  };

  const logout = async (): Promise<any> => {
    return await $fetch("/api/auth/logout", {
      method: "POST",
    });
  };

  return {
    login,
    loginWithGoogle,
    logout,
    user,
  };
};

export default useAuth;
