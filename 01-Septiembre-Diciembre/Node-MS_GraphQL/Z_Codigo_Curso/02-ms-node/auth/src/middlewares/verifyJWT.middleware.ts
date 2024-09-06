import { NextFunction, Request, Response } from "express";

import { jwtVerify, googleVerify } from "../helpers/jwt.helper";

export const verifyJWTMiddleware = (
  req: any | Request,
  res: Response,
  next: NextFunction
) => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(403).json({
      ok: false,
      message: "Token is required",
    });
  }

  try {
    const token = authorization.split(" ")[1];

    const { id }: any = jwtVerify(token);

    req.uid = id;

    next();
  } catch (error) {
    return res.status(500).json({ ok: false, error });
  }
};

export const verifyGoogleIdTokenMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { token } = req.body;

  if (!token) {
    return res
      .status(403)
      .json({ ok: false, message: "User not authenticated" });
  }

  const googleUser = await googleVerify(token);

  if (!googleUser) {
    return res
      .status(403)
      .json({ ok: false, message: "User not authenticated" });
  }

  req.body.email = googleUser.email;
  req.body.username = googleUser.username;

  next();
};
