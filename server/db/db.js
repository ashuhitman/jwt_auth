import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// get environment variables
const URI = process.env.DB_URI;

mongoose
  .connect(URI)
  .then(() => console.log("connected to database"))
  .catch((error) => console.error("db connection error: ", error));
