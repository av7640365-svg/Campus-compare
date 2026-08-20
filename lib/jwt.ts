import { SignJWT, jwtVerify } from "jose";

const secretKey = new TextEncoder().encode(
  process.env.JWT_SECRET || "campuscompare-super-secret-key"
);

export async function createToken(userId: string) {
  return await new SignJWT({
    userId,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secretKey);

    return payload;
  } catch {
    return null;
  }
}