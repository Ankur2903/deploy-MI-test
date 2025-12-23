import mongoose from "mongoose";

const mongo_url = process.env.MONGO_CONN;

mongoose
  .connect(mongo_url)
  .then(() => {
    console.log("DB is working...");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
