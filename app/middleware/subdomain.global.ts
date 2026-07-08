export default defineNuxtRouteMiddleware(() => {
  const url = useRequestURL();

  const host = url.hostname || "";
  const rootDomain = process.env.NUXT_PUBLIC_ROOT_DOMAIN || "";
  const ignoredSubdomains = ["www"];

  let subdomain: string | null = null;

  if (host.endsWith(`.${rootDomain}`))
    subdomain = host.replace(`.${rootDomain}`, "");

  if (host.endsWith(".localhost")) subdomain = host.replace(".localhost", "");

  if (subdomain && ignoredSubdomains.includes(subdomain)) subdomain = null;

  const currentSubdomain = useState<string | null>("subdomain", () => null);
  currentSubdomain.value = subdomain;
});
