import { auth } from "auth"
import { importJWK, JWK, SignJWT } from "jose";

const POLICY_ID = '8873b874-55e5-44c5-b91d-ec257dbd0173';

const PRIV_KEY = process.env.PRIV_KEY;

const PRIVATE_KEY_FOR_JWT_WITH_PREX = {
  "kty": "EC",
  "crv": "P-256",
  "x": "FPk7a1CJvVW5Zr76g5cPRwUSItTxBTf_eybEso8rG14",
  "y": "sQLMLUF9ITldprrQKVY58qoQorScUukyYXpYfdsKEGA",
  "d": PRIV_KEY,
};

async function generateIdTokenForUser(userId: string) {
  const privateKey = await importJWK(PRIVATE_KEY_FOR_JWT_WITH_PREX, "ES256");

  const jwt = await new SignJWT({})
    .setProtectedHeader({ alg: "ES256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .setAudience(POLICY_ID.toString())
    .setSubject(userId)
    .sign(privateKey);
  return jwt;
}

export const GET = auth(async (req) => {
  if (req.auth && req.auth.userId) {
    const idToken = await generateIdTokenForUser(req.auth.userId);
    return Response.json({ data: idToken })
  }

  return Response.json({ message: "Not authenticated" }, { status: 401 })
}) as any

