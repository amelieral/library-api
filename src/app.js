import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import userRoutes from "./routes/userRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import logger from "./middleware/logger.js";
import errorHandler from "./middleware/errorHandler.js";

dotenv.config();

const { PORT = 3005, API_URL = "http://127.0.0.1", MONGO_URI } = process.env;

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);

app.use("/users", userRoutes);
app.use("/books", bookRoutes);

app.get("/", (req, res) => {
  res.status(200).send("Library API работает");
});

app.use((req, res) => res.status(404).json({ message: "Ресурс не найден" }));

app.use(errorHandler);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Сервер запущен: ${API_URL}:${PORT}`);
    });
  })
  .catch((err) => console.error("Ошибка подключения к MongoDB:", err));