import "dotenv/config";

// import "express-async-errors";

import app from "./app";
app.listen(4000, () => {
  console.log("Listening on 4000 :: server is running");
});
