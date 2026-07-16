export default defineNuxtRouteMiddleware(() => {
  const config = useRuntimeConfig();
  const url = useRequestURL();

  const host = normalizeHostname(url.hostname);
  const rootDomain = normalizeHostname(config.public.rootDomain);
  const reservedSubdomains = ["app"];

  let subdomain: string | null = null;

  if (rootDomain && host.endsWith(`.${rootDomain}`))
    subdomain = host.replace(`.${rootDomain}`, "");

  if (host.endsWith(".localhost")) subdomain = host.replace(".localhost", "");

  const accessContext = subdomain
    ? reservedSubdomains.includes(subdomain)
      ? "admin"
      : "showcase"
    : "institutional";

  const currentSubdomain = useState<string | null>("subdomain", () => null);
  currentSubdomain.value = accessContext === "showcase" ? subdomain : null;

  const currentAccessContext = useState<"institutional" | "admin" | "showcase">(
    "access-context",
    () => "institutional",
  );
  currentAccessContext.value = accessContext;
});

const normalizeHostname = (value: unknown) => {
  return String(value || "")
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/:\d+$/, "")
    .replace(/\/$/, "")
    .toLowerCase();
};
