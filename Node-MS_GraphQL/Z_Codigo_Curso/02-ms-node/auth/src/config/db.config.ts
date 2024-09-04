import mongoose from "mongoose";

export const connectionDB = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECTION);

    console.log("DB Connected");
  } catch (error) {
    console.log("Connection error");
  }
};
