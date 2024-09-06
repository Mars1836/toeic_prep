import { Response } from "express";
import { handleError, verifyUser } from "@cl-ticket/common";
import cookieSession from "cookie-session";
import { handleAsync } from "@cl-ticket/common";

import cors from "cors";
const express = require("express");
const app = express();
app.set("trust proxy", true);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const corsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => {
    callback(null, true);
  },
  credentials: true,
};

app.use(cors(corsOptions));

app.use(
  cookieSession({
    signed: false,
    // secure: true, // must be connect in https connection
  })
);

app.use("/test", (req: Request, res: Response) => {
  res.json("test");
});

app.use(handleError);
export default app;
