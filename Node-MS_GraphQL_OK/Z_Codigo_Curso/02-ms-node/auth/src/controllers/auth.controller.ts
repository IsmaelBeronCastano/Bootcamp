import { Request, Response } from "express";

import User from "../models/user.model";
import { jwtSign } from "../helpers/jwt.helper";

export const renewToken = (req: Request | any, res: Response) => {
  const { uid } = req;

  const token = jwtSign({
    id: uid,
  });

  return res.status(200).json({ ok: true, jwt: token });
};

export const register = async (req: Request, res: Response) => {
  const { email, username, password } = req.body;

  try {
    const user = new User({ username, password, email });

    await user.save();

    const token = jwtSign({
      id: user.id,
    });

    return res.status(200).json({
      ok: true,
      message: "User registration successful",
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      jwt: token,
    });
  } catch (error) {
    console.log(`Error find: ${error}`);

    return res.status(500).json({
      error,
      ok: false,
    });
  }
};

export const login = async (req: Request | any, res: Response) => {
  const uid = req.uid;

  try {
    const user = await User.findById(uid);

    const token = jwtSign({
      id: uid,
    });

    return res.status(200).json({
      ok: true,
      message: "User Login successful",
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      jwt: token,
    });
  } catch (error) {
    console.log(`Error find: ${error}`);

    return res.status(500).json({
      error,
      ok: false,
    });
  }
};

export const googleSSO = async (req: Request, res: Response) => {
  const { email, username } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({ username, password: ":v", email, google: true });
      await user.save();
    }

    const token = jwtSign({
      id: user.id,
    });

    return res.status(200).json({
      ok: true,
      message: "User signin google",
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      jwt: token,
    });
  } catch (error) {
    console.log(`Error find: ${error}`);

    return res.status(500).json({
      error,
      ok: false,
    });
  }
};
