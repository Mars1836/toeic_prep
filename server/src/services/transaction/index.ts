import { TransactionStatus } from "../../configs/enum";
import { transactionModel } from "../../models/transaction.model";

import { TransactionAttr } from "../../models/transaction.model";

export namespace TransactionSrv {
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
}
