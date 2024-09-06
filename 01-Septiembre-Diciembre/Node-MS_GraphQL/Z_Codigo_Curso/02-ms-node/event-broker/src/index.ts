import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";

import { eventBrokerController } from "./controllers/events.controller";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

app.use(morgan("dev"));

app.post("/events", eventBrokerController);

app.listen(port, () => {
  console.log("Event Broker is running on port:", port);
});
