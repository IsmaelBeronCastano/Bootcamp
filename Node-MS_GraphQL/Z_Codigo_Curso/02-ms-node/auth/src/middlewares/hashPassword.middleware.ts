import { NextFunction, Request, Response } from "express";

import { comparePassword, hashPassword } from "../helpers/hashPassword.helper";
import User from "../models/user.model";

export const hashPasswordMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { password } = req.body;

  if (!password) {
    return res.status(403).json({
      ok: false,
      message: "password is required",
    });
  }

  const hash = hashPassword(password);

  req.body.password = hash;

  next();
};

export const validatePasswordMiddleware = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  const { password } = req.body;
  const uid = req.uid;

  if (!password) {
    return res.status(403).json({
      ok: false,
      message: "password is required",
    });
  }

  const user = await User.findById(uid);

  if (!user || !user.active) {
    return res.status(404).json({
      ok: false,
      message: "Email or password invalid",
    });
  }

  if (user.google) {
    return res.status(403).json({
      ok: false,
      message: "User must log in with google",
    });
  }

  const hash = user.password;

  const result = comparePassword(password, hash);

  if (!result) {
    return res.status(403).json({
      ok: false,
      message: "Email or password invalid",
    });
  }

  next();
};
