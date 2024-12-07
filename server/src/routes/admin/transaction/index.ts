import express from "express";
import TransactionCtr from "../../../controllers/transaction";
import { handleAsync } from "../../../middlewares/handle_async";

const adminTransactionRouter = express.Router();
adminTransactionRouter.get(
  "/last-7-months",
  handleAsync(TransactionCtr.getTransactionsLast7Months)
);
adminTransactionRouter.get(
  "/last-7-days",
  handleAsync(TransactionCtr.getTransactionsLast7Days)
);
adminTransactionRouter.get(
  "/last-7-years",
  handleAsync(TransactionCtr.getTransactionsLast7Years)
);
adminTransactionRouter.get("/", handleAsync(TransactionCtr.getTransactions));
export default adminTransactionRouter;
