import "dotenv";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { FileRoutes } from "./routes";

const app = express();

app.use(cors());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  app.use(cors());
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/files", FileRoutes);

app.listen(process.env.PORT || 3330);
