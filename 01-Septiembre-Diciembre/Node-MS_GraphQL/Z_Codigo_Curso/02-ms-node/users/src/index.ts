import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { UsersRoutes } from "./routes";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cors());

app.get("/", (req, res) => {
  res.send(`Users Microservice is running: ${port}`);
});

app.use("/users", UsersRoutes);

app.listen(port, () => {
  console.log("Users Microservice is running on port:", port);
});
