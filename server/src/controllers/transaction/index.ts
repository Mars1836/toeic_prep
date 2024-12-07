import TransactionSrv from "../../services/transaction";
import { Request, Response } from "express";
namespace TransactionCtr {
  export async function getTransactionsLast7Months(
    req: Request,
    res: Response
  ) {
    const stats = await TransactionSrv.getTransactionsLast7Months();
    res.status(200).json(stats);
  }
  export async function getTransactionsLast7Days(req: Request, res: Response) {
    const stats = await TransactionSrv.getTransactionLast7Days();
    res.status(200).json(stats);
  }
  export async function getTransactionsLast7Years(req: Request, res: Response) {
    const stats = await TransactionSrv.getTransactionLast7Years();
    res.status(200).json(stats);
  }
  export async function getTransactions(req: Request, res: Response) {
    const transactions = await TransactionSrv.getTransactions(req.query);
    res.status(200).json(transactions);
  }
}
export default TransactionCtr;
