import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { ProductsRoutes } from "./routes";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cors());

app.get("/", (req, res) => {
  res.send(`Products Microservice is running: ${port}`);
});

app.use("/products", ProductsRoutes);

app.listen(port, () => {
  console.log("Products Microservice is running on port:", port);
});
