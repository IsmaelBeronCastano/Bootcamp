import { Request, Response } from "express";
import { IUser } from "../interfases/users.interface";

const users: IUser[] = [
  {
    id: "1",
    name: "First User",
    email: "firs@mail.com",
  },
];

export const getAll = (req: Request, res: Response) => {
  return res.status(200).json({ message: "OK", users });
};
