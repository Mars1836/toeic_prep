import { TransactionStatus } from "../../configs/enum";
import { transactionModel } from "../../models/transaction.model";

import { TransactionAttr } from "../../models/transaction.model";
namespace TransactionSrv {
  export async function create(data: TransactionAttr) {
    const initData = {
      ...data,
      status: TransactionStatus.pending,
    };
    const newTransaction = await transactionModel.create(initData);
    return newTransaction;
  }
  export async function updateByProviderId(
    providerId: string,
    data: Partial<TransactionAttr>
  ) {
    const updatedTransaction = await transactionModel.findOneAndUpdate(
      { providerId },
      data,
      {
        new: true,
      }
    );
    return updatedTransaction;
  }
  export async function getTransactionsLast7Months() {
    const now = new Date();
    const sevenMonthsAgo = new Date();
    sevenMonthsAgo.setMonth(now.getMonth() - 7);

    const stats = await transactionModel.aggregate([
      // Lọc giao dịch trong 7 tháng trước
      {
        $match: {
          createdAt: { $gte: sevenMonthsAgo, $lte: now },
        },
      },
      // Nhóm theo tháng và năm
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          totalAmount: { $sum: "$amount" }, // Tổng số tiền giao dịch
          count: { $sum: 1 }, // Tổng số giao dịch
        },
      },
      // Sắp xếp theo thứ tự thời gian
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    return stats;
  }
  export async function getTransactionLast7Days() {
    const now = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);

    const stats = await transactionModel.aggregate([
      // Lọc giao dịch trong 7 ngày trước
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo, $lte: now },
        },
      },
      // Nhóm theo ngày
      {
        $group: {
          _id: {
            day: { $dayOfMonth: "$createdAt" },
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      // Sắp xếp theo ngày
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
    ]);

    return stats;
  }
  export async function getTransactionLast7Years() {
    const now = new Date();
    const sevenYearsAgo = new Date();
    sevenYearsAgo.setFullYear(now.getFullYear() - 7);

    const stats = await transactionModel.aggregate([
      // Lọc giao dịch trong 7 năm trước
      {
        $match: {
          createdAt: { $gte: sevenYearsAgo, $lte: now },
        },
      },
      // Nhóm theo năm
      {
        $group: {
          _id: { year: { $year: "$createdAt" } },
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      // Sắp xếp theo năm
      { $sort: { "_id.year": 1 } },
    ]);

    return stats;
  }
  export async function getTransactions(query: any) {
    const transactions = await transactionModel.find(query);
    return transactions;
  }
}
export default TransactionSrv;
