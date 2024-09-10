import axios from "axios";

const productsApi = axios.create({
  baseURL: "http://localhost:3002/products",
});

export const getAllProducts = async () => {
  const { data } = await productsApi.get("/all");

  return data;
};
