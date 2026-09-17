export type JwtPayload = {
  exp?: number;
  email?: string;
  name?: string;
  preferred_username?: string;
  sub?: string;
};

/** Decodes a JWT payload WITHOUT verifying it. The server is the authority;
 *  the page only reads `exp` and a couple of display fields. Nothing here is
 *  a security decision. */
export function decodeToken(token: string): JwtPayload | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(
      decodeURIComponent(
        json
          .split("")
          .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
          .join(""),
      ),
    );
  } catch {
    return null;
  }
}

/** True when the token is expired, or expires within `bufferSeconds`. */
export function isTokenExpired(token: string, bufferSeconds = 60): boolean {
  const exp = decodeToken(token)?.exp;
  if (!exp) return true;
  return exp < Math.floor(Date.now() / 1000) + bufferSeconds;
}

/** Seconds until expiry, or 0 if already expired. */
export function secondsUntilExpiry(token: string): number {
  const exp = decodeToken(token)?.exp;
  if (!exp) return 0;
  return Math.max(0, exp - Math.floor(Date.now() / 1000));
}
