import jwt, { type SignOptions } from "jsonwebtoken";

interface TokenPayload {
  userId: string;
  organizationId: string;
  role: string;
}

const generateToken = (
  payload: TokenPayload
) => {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET as string,
    {
      expiresIn: "7d",
    } as SignOptions
  );
};

export default generateToken;