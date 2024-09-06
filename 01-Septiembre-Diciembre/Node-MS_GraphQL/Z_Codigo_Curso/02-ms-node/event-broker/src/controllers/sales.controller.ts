import axios from "axios";

interface ISale {
  uid: string;
  product_id: string;
  quantity: number;
}

const salesApi = axios.create({
  baseURL: "http://localhost:3004/sales",
});

export const getAllSales = async () => {
  const { data } = await salesApi.get("/all");

  return data;
};

export const createSale = async (payload: ISale) => {
  const { data } = await salesApi.post("/create", { data: payload });

  return data;
};
