import { TestAttr, testModel } from "../../models/test.model";

namespace TestSrv {
  export async function create(data: TestAttr) {
    const newTest = await testModel.create(data);
    return newTest;
  }
  export async function getAll() {
    const rs = await testModel.find({});
    return rs;
  }
  export async function getByCode(code: string) {
    const rs = await testModel.findOne({
      code: code,
    });
    return rs;
  }
  export async function getById(id: string) {
    const rs = await testModel.findById(id);
    return rs;
  }
  export async function getByQuery(query: {
    id?: string;
    limit: number;
    skip: number;
  }) {
    const { skip, limit, ...data } = query;
    const rs = await testModel
      .find({
        ...data,
      })
      .sort({ createdAt: -1 })
      .skip(query.skip || 0)
      .limit(query.limit || 3);
    return rs;
  }
  // export async function addAttempt(){

  // }
  export async function updateAll(updateData: object) {
    const rs = await testModel.updateMany(
      {}, // Filter criteria
      { ...updateData } // Data to update
    );
    return rs;
  }
}
export default TestSrv;
