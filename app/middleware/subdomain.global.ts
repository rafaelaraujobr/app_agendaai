export default defineNuxtRouteMiddleware(() => {
  const config = useRuntimeConfig();
  const url = useRequestURL();

  const host = normalizeHostname(url.hostname);
  const rootDomain = normalizeHostname(config.public.rootDomain);
  const ignoredSubdomains = ["www"];

  let subdomain: string | null = null;

  if (rootDomain && host.endsWith(`.${rootDomain}`))
    subdomain = host.replace(`.${rootDomain}`, "");

  if (host.endsWith(".localhost")) subdomain = host.replace(".localhost", "");

  if (subdomain && ignoredSubdomains.includes(subdomain)) subdomain = null;

  const currentSubdomain = useState<string | null>("subdomain", () => null);
  currentSubdomain.value = subdomain;
});

const normalizeHostname = (value: unknown) => {
  return String(value || "")
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/:\d+$/, "")
    .replace(/\/$/, "")
    .toLowerCase();
};
