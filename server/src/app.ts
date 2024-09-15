import { Response } from "express";
import cookieSession from "cookie-session";

import cors from "cors";
import { handleError } from "./middlewares/handle_error";
import { passportU } from "./configs/passport";
import routerU from "./routes/user";
import routerA from "./routes/admin";
const express = require("express");
const app = express();
app.set("trust proxy", true);
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

// app.use(
//   cookieSession({
//     signed: false,
//     // secure: true, // must be connect in https connection
//   })
// );
app.use(
  "/api/user",
  cookieSession({
    name: "user-session",
    signed: false,
    // secure: true, // must be connect in https connection
  })
);
app.use(
  "/api/admin",
  cookieSession({
    name: "admin-session",
    signed: false,
    // secure: true, // must be connect in https connection
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passportU.initialize({ userProperty: "user" }));
app.use(passportU.session());
app.use(passportU.initialize({ userProperty: "user" }));
app.use(passportU.session());
app.use("/api/user", routerU);
app.use("/api/admin", routerA);
app.use("/test", (req: Request, res: Response) => {
  res.json("test");
});

app.use(handleError);
export default app;
