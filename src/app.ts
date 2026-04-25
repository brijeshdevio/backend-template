import express from "express";
import { routes } from "./routes";
import { errorHandler } from "./middleware/error-handler";

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api", (_, res) => {
  res.send(`Welcome to the Backend Starter!`);
});

app.use("/api/v1", routes);

app.use(errorHandler);
