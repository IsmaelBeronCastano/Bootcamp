import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cors());

app.use(express.json());

app.post("/api/v1/", async (req: Request, res: Response) => {
  const { event, data: requestData } = req.body;

  if (!event) {
    return res.status(400).json({
      message: "Event is required",
    });
  }

  try {
    const { data } = await axios.post("http://localhost:3001/events", {
      event: event.toUpperCase(),
      data: requestData,
    });

    return res.status(200).json({
      message: "Success",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error",
      error,
    });
  }
});

app.listen(port, () => {
  console.log("API GATEWAY is running on port:", port);
});
