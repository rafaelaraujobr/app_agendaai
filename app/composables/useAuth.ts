const useAuth = () => {
  const { user, fetch } = useUserSession();

  const login = async (email: string, password: string) => {
    const response = await $fetch("/api/auth/login", {
      method: "POST",
      body: { email, password },
    });

    await fetch(); //atualiza o estado do usuario

    return response;
  };

  const loginWithGoogle = async () => {
    await navigateTo("/api/auth/google", { external: true });
  };

  const logout = async (): Promise<any> => {
    const response = await $fetch("/api/auth/logout", {
      method: "POST",
    });

    await fetch(); //atualiza o estado do usuario

    return response;
  };

  return {
    login,
    loginWithGoogle,
    logout,
    user,
  };
};

export default useAuth;
