import axios from "axios";

const usersApi = axios.create({
  baseURL: "http://localhost:3003/users",
});

export const getAllUsers = async () => {
  const { data } = await usersApi.get("/all");

  return data;
};
