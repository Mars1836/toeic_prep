import { configZalo } from "../../configs/zalopay";
import { generateMac } from "../../utils";
import axios from "axios";
import moment from "moment";
import qs from "qs";
import { BadRequestError } from "../../errors/bad_request_error";
import UserRepo from "../user/repos";
import TransactionSrv from "../transaction";
import { TransactionStatus, TransactionType } from "../../configs/enum";
import { firebase, get, ref } from "../../configs/firebase";
import ToeicTestingSrv from "../toeic_testing";
import { toeicTestingModel } from "../../models/toeic_testing.model";
import TestRegistrationSrv from "../test_registration";
namespace PaymentSrv {
  async function getServerUrl() {
    if (process.env.PLATFORM !== "WEB") {
      const snapshotServerUrl = await get(ref(firebase, "ngrok/url1"));
      return snapshotServerUrl.val() || "http://localhost:4000";
    }
    const snapshotServerUrl = await get(ref(firebase, "webclient/server"));
    return snapshotServerUrl.val() || "http://localhost:4000";
  }

  async function getClientUrl() {
    const snapshotClientUrl = await get(ref(firebase, "webclient/client"));
    return snapshotClientUrl.val() || "http://localhost:3000";
  }
  export async function create(userId: string) {
    const items = [
      { userId: userId, upgradeFor: 30, type: TransactionType.upgrade_account },
    ];
    const transID = Math.floor(Math.random() * 1000000);
    let origin;
    let clientUrl;
    origin = await getServerUrl();
    clientUrl = await getClientUrl();
    const order = {
      app_id: configZalo.app_id,
      app_trans_id: `${moment().format("YYMMDD")}_${transID}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
      app_user: userId,
      app_time: Date.now(), // miliseconds
      item: JSON.stringify(items),
      embed_data: JSON.stringify({ redirectUrl: clientUrl }),
      amount: 5000,
      description: `UPGRADE - Payment for the upgrade account #${transID}`,
      callback_url: configZalo.callbackUrl(origin!),
      bank_code: "",
      mac: "",
    };

    const newTransaction = await TransactionSrv.create({
      userId: userId,
      type: TransactionType.upgrade_account,
      amount: order.amount,
      currency: "VND",
      description: `Toeic - Payment for the upgrade account #${transID}`,
      providerId: order.app_trans_id,
      status: TransactionStatus.pending,
    });
    const data =
      configZalo.app_id +
      "|" +
      order.app_trans_id +
      "|" +
      order.app_user +
      "|" +
      order.amount +
      "|" +
      order.app_time +
      "|" +
      order.embed_data +
      "|" +
      order.item;
    order.mac = generateMac(data, configZalo.key1);
    const rs = await axios.post(configZalo.endpointCreate, null, {
      params: order,
    });
    const datars = rs.data;
    datars.trans_id = order.app_trans_id;
    datars.callbackUrl = configZalo.callbackUrl(origin!);
    return datars;
  }
  export async function createTestRegistration(payload: {
    userId: string;
    examId: string;
    personalInfo: any;
  }) {
    const toeicTest = await toeicTestingModel.findById(payload.examId);
    if (!toeicTest) {
      throw new BadRequestError("Kỳ thi không tồn tại");
    }
    const items = [
      {
        userId: payload.userId,
        toeicTestId: payload.examId,
        type: TransactionType.test_registration,
        data: JSON.stringify(payload),
      },
    ];
    const transID = Math.floor(Math.random() * 1000000);
    let origin;
    let clientUrl;
    origin = await getServerUrl();
    clientUrl = await getClientUrl();
    const order = {
      app_id: configZalo.app_id,
      app_trans_id: `${moment().format("YYMMDD")}_${transID}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
      app_user: payload.userId,
      app_time: Date.now(), // miliseconds
      item: JSON.stringify(items),
      embed_data: JSON.stringify({ redirectUrl: clientUrl }),
      amount: toeicTest.price,
      description: `REGISTRATION - Payment for the test registration #${transID}`,
      callback_url: configZalo.callbackUrl(origin!),
      bank_code: "",
      mac: "",
    };
    console.log(configZalo.callbackUrl(origin!));

    const newTransaction = await TransactionSrv.create({
      userId: payload.userId,
      type: TransactionType.test_registration,
      amount: order.amount,
      currency: "VND",
      description: `Toeic - Payment for the test registration #${transID}`,
      providerId: order.app_trans_id,
      status: TransactionStatus.pending,
    });
    const data =
      configZalo.app_id +
      "|" +
      order.app_trans_id +
      "|" +
      order.app_user +
      "|" +
      order.amount +
      "|" +
      order.app_time +
      "|" +
      order.embed_data +
      "|" +
      order.item;
    order.mac = generateMac(data, configZalo.key1);
    const rs = await axios.post(configZalo.endpointCreate, null, {
      params: order,
    });
    const datars = rs.data;
    datars.trans_id = order.app_trans_id;
    datars.callbackUrl = configZalo.callbackUrl(origin!);
    return datars;
  }
  export async function callback(data: { data: string; mac: string }) {
    let result = {
      return_code: -1,
      return_message: "",
      data: {},
    };
    let dataStr = data.data;
    let reqMac = data.mac;

    let mac = generateMac(dataStr, configZalo.key2);

    // kiểm tra callback hợp lệ (đến từ ZaloPay server)
    if (reqMac !== mac) {
      // callback không hợp lệ
      throw new BadRequestError("mac not equal");
    } else {
      console.log("callback success");
      // thanh toán thành công
      // merchant cập nhật trạng thái cho đơn hàng ở đây
      let dataJson = JSON.parse(dataStr);
      result.return_code = 1;
      result.return_message = "success";
      result.data = dataJson;
      console.log("dataJson: ");
      let item = JSON.parse(dataJson.item);
      console.log("item: ");
      console.log(item);
      item.forEach(async (item: any) => {
        if (item.type === TransactionType.upgrade_account) {
          await UserRepo.upgrade(item.userId);
        } else if (item.type === TransactionType.test_registration) {
          await TestRegistrationSrv.create(JSON.parse(item.data));
        }
      });
      await TransactionSrv.updateByProviderId(dataJson.app_trans_id, {
        status: TransactionStatus.success,
      });
      return result;
    }
  }
  export async function getStatus(transId: string) {
    if (!transId) {
      throw new BadRequestError("transId is required");
    }
    let postData = {
      app_id: configZalo.app_id,
      app_trans_id: transId, // Input your app_trans_id
      mac: "",
    };

    let data =
      postData.app_id + "|" + postData.app_trans_id + "|" + configZalo.key1; // appid|app_trans_id|key1
    postData.mac = generateMac(data, configZalo.key1);
    let postConfig = {
      method: "post",
      url: configZalo.endpointQuery,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: qs.stringify(postData),
    };
    try {
      const rs = await axios(postConfig);
      if (rs.data.return_code === 1) {
        rs.data.status = TransactionStatus.success;
      } else if (rs.data.return_code === 2) {
        rs.data.status = TransactionStatus.failed;
      } else {
        rs.data.status = TransactionStatus.pending;
      }
      return rs.data;
    } catch (error) {
      throw new BadRequestError("Fetch zalo to query status get error!");
    }
  }
}
export default PaymentSrv;
