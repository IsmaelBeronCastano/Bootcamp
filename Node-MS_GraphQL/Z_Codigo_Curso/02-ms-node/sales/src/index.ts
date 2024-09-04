import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { SalesRoutes } from "./routes";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.send(`Sales Microservice is running: ${port}`);
});

app.use("/sales", SalesRoutes);

app.listen(port, () => {
  console.log("Sales Microservice is running on port:", port);
});
