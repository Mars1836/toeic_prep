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
  export async function getByQuery(query: { id?: string }) {
    const rs = await testModel.find({
      ...query,
    });
    return rs;
  }
}
export default TestSrv;
