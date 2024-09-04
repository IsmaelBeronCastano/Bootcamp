import jwt from "jsonwebtoken";

import { OAuth2Client } from "google-auth-library";

import { IUserPayload } from "../interfaces/IUserPayload.interface";

export const jwtSign = (payload: IUserPayload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  return token;
};

export const jwtVerify = (token: string) => {
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    return payload;
  } catch (error) {
    throw error;
  }
};

export const googleVerify = async (token: string) => {
  const client = new OAuth2Client();

  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  return { email: payload.email, username: payload.name };
};
