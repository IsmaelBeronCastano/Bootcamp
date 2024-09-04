import path from "node:path";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { AuthRoutes } from "./routes";

import { connectionDB } from "./config/db.config";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

connectionDB();

app.use("/auth", AuthRoutes);

app.listen(port, () => {
  console.log("Auth Microservice is running on port:", port);
});
