// Cloudflare Turnstile — server-side verification of the challenge token.
// Fails OPEN when TURNSTILE_SECRET_KEY isn't set, so the site keeps working
// before the keys are added (mirrors the rate-limiter's fail-open behavior);
// once the secret is set, a valid token is required.
export async function verifyTurnstile(
  token: string | undefined,
  ip?: string,
): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // not configured → don't block anyone
  if (!token) return false; // configured but no token → treat as a bot

  try {
    const body = new URLSearchParams({ secret, response: token });
    if (ip && ip !== 'unknown') body.set('remoteip', ip);
    const res = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
      },
    );
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    // Cloudflare unreachable (transient) — fail open so a real visitor isn't
    // blocked by an outage. Turnstile's endpoint is highly available, so this
    // is a rare edge, and the honeypot still applies.
    return true;
  }
}
