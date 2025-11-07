export function getCookieString(
  name: string,
  value: string,
  maxAge: number = 7 * 24 * 60 * 60
): string {
  const isProduction = process.env.NODE_ENV === "production";
  
  if (isProduction) {
    return `${name}=${value}; HttpOnly; Path=/; Max-Age=${maxAge}; SameSite=None; Secure`;
  } else {
    return `${name}=${value}; HttpOnly; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
  }
}

