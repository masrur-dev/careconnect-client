// Single source of truth for the Express backend base URL.
// Server components and client components both read this — it is not a secret.
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export function apiUrl(path) {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${p}`;
}

let tokenCache = { token: null, expiresAt: 0 };

/**
 * Returns a Better Auth JWT for the current session (cached until expiry).
 * Returns null when the user is not signed in.
 */
export async function getJwt() {
  if (typeof window === "undefined") return null;

  const now = Date.now();
  if (tokenCache.token && now < tokenCache.expiresAt) {
    return tokenCache.token;
  }

  try {
    const res = await fetch("/api/auth/token", {
      credentials: "include",
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data?.token) return null;

    // Refresh 30s before expiry; default Better Auth JWT lifetime is 1h.
    let expiresAt = now + 30 * 60 * 1000;
    try {
      const payload = JSON.parse(
        atob(data.token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
      );
      if (payload.exp) expiresAt = payload.exp * 1000 - 30 * 1000;
    } catch {
      /* keep fallback expiry */
    }

    tokenCache = { token: data.token, expiresAt };
    return data.token;
  } catch {
    return null;
  }
}

export function clearJwt() {
  tokenCache = { token: null, expiresAt: 0 };
}

/**
 * Fetch the Express API with a Bearer JWT attached (when signed in).
 * Pass `auth: false` for public endpoints.
 */
export async function apiFetch(path, options = {}, { auth = true } = {}) {
  const headers = new Headers(options.headers || {});
  headers.set("Accept", "application/json");

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (auth) {
    const token = await getJwt();
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }

  return fetch(apiUrl(path), {
    ...options,
    headers,
    credentials: "omit",
  });
}
