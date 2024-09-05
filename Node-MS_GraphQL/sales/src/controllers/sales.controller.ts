import axios from "axios";
import { Request, Response } from "express";

const eventBroker = axios.create({
  baseURL: "http://localhost:3001",
});

const sales: any[] = [];

export const getAll = (req: Request, res: Response) => {
  return res.status(200).json({ message: "OK", sales });
};

export const createSale = async (req: Request, res: Response) => {
  const { data } = req.body;

  const { quantity } = data;

  const { data: user } = await eventBroker.post("/events", {
    event: "GET_USERS",
  });

  const { data: product } = await eventBroker.post("/events", {
    event: "GET_PRODUCTS",
  });

  const sale = {
    user: user.data.users[0],
    product: product.data.products[0],
    quantity,
    price: {
      unit: product.data.products[0]?.price,
      total: product.data.products[0]?.price * quantity,
    },
  };

  sales.push(sale);

  return res.status(200).json({ message: "OK", sales: sale });
};
