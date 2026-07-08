const useAuth = () => {
  const { user, fetch } = useUserSession();


  const login = async (email: string, password: string): Promise<void> => {
    await $fetch("/api/auth/login", {
      method: "POST",
      body: { email, password },
    });
    await fetch();
  };

  const loginWithGoogle = async (): Promise<void> => {
    await navigateTo("/api/auth/google", { external: true });
  };

  const logout = async (): Promise<void> => {
    await $fetch("/api/auth/logout", {
      method: "POST",
    });
    await fetch(); //atualiza o estado do usuario
  };

  return {
    login,
    loginWithGoogle,
    logout,
    user,
  };
};

export default useAuth;
