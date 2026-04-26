import crypto from "crypto";

/**
 * Short-lived signed token for granting Microsoft Office Online viewer (or
 * Google Docs viewer) access to a private asset file.
 *
 * The token encodes assetId + userId + expiry + HMAC signature using
 * NEXTAUTH_SECRET. It's URL-safe base64.
 */

const TOKEN_TTL_SECONDS = 600; // 10 minutes — enough for the embed iframe to load

function getSecret(): string {
  const s = process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET;
  if (!s) throw new Error("NEXTAUTH_SECRET is not set");
  return s;
}

function b64url(buf: Buffer): string {
  return buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64urlDecode(s: string): Buffer {
  const pad = s.length % 4 === 0 ? 0 : 4 - (s.length % 4);
  return Buffer.from(s.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat(pad), "base64");
}

export function signAssetToken(assetId: string, userId: string): string {
  const exp = Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS;
  const payload = JSON.stringify({ a: assetId, u: userId, e: exp });
  const payloadB64 = b64url(Buffer.from(payload, "utf8"));
  const sig = crypto.createHmac("sha256", getSecret()).update(payloadB64).digest();
  return `${payloadB64}.${b64url(sig)}`;
}

export function verifyAssetToken(
  token: string
): { assetId: string; userId: string } | null {
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payloadB64, sigB64] = parts;

  const expectedSig = crypto.createHmac("sha256", getSecret()).update(payloadB64).digest();
  const givenSig = b64urlDecode(sigB64);
  if (
    expectedSig.length !== givenSig.length ||
    !crypto.timingSafeEqual(expectedSig, givenSig)
  ) {
    return null;
  }

  let payload: { a?: string; u?: string; e?: number };
  try {
    payload = JSON.parse(b64urlDecode(payloadB64).toString("utf8"));
  } catch {
    return null;
  }

  if (!payload.a || !payload.u || !payload.e) return null;
  if (payload.e < Math.floor(Date.now() / 1000)) return null;

  return { assetId: payload.a, userId: payload.u };
}
