import express, { Express, Request, Response } from "express";
import { PORT } from "./secrets";
import rootRouter from "./routes/index.routes";
import { PrismaClient } from "@prisma/client";
import { errorMiddleware } from "./middleware/error.middleware";
import { SignupSchema } from "./schema/users.scheam";
const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", rootRouter);

export const prismaClient = new PrismaClient({
  log: ["query"],
});

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});
