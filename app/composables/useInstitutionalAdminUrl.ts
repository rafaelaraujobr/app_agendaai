export const useInstitutionalAdminUrl = () => {
  const config = useRuntimeConfig();
  const requestUrl = useRequestURL();

  const normalizeDomain = (value: unknown) =>
    String(value || "")
      .replace(/^https?:\/\//, "")
      .replace(/^www\./, "")
      .replace(/\/$/, "");

  const adminUrl = computed(() => {
    const port = requestUrl.port ? `:${requestUrl.port}` : "";

    if (
      requestUrl.hostname === "localhost" ||
      requestUrl.hostname.endsWith(".localhost")
    ) {
      return `${requestUrl.protocol}//app.localhost${port}/auth/login`;
    }

    const rootDomain = normalizeDomain(config.public.rootDomain);
    return rootDomain
      ? `${requestUrl.protocol}//app.${rootDomain}/auth/login`
      : "/auth/login";
  });

  return { adminUrl };
};
