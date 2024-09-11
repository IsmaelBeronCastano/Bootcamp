import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";

export const validateEmailMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;

  const exist = await User.findOne({ email });

  if (exist) {
    return res.status(403).json({
      ok: false,
      message: "User already registered",
    });
  }

  next();
};

export const validateEmailRegistryMiddleware = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user || !user.active) {
    return res.status(403).json({
      ok: false,
      message: "Email or password invalid",
    });
  }

  req.uid = user.id;

  next();
};
