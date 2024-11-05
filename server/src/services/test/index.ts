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
}
export default TestSrv;
