import { auth } from "auth"
import { importJWK, SignJWT } from "jose";

const POLICY_ID = process.env.NEXT_PUBLIC_POLICY_ID || "";

const PRIV_KEY_STRING = process.env.PRIV_KEY || "{}"

const PRIVATE_KEY_FOR_JWT_WITH_PREX = JSON.parse(PRIV_KEY_STRING);


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

