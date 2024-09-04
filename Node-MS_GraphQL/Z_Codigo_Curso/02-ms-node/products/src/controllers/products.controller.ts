import { Request, Response } from "express";
import { IProduct } from "../interfases/products.interface";

const products: IProduct[] = [
  {
    id: "1",
    name: "Teclado Mecanico",
    price: 150,
    description: "Teclado Mecanico",
  },
];

export const getAll = (req: Request, res: Response) => {
  return res.status(200).json({ message: "OK", products });
};
