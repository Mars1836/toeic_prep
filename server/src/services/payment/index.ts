import { configZalo, embedDataZalo } from "../../configs/zalopay";
import { generateMac } from "../../utils";
import axios from "axios";
import moment from "moment";
import qs from "qs";
import { BadRequestError } from "../../errors/bad_request_error";

namespace PaymentSrv {
  export async function create() {
    const items = [{}];
    const transID = Math.floor(Math.random() * 1000000);
    const order = {
      app_id: configZalo.app_id,
      app_trans_id: `${moment().format("YYMMDD")}_${transID}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
      app_user: "user123",
      app_time: Date.now(), // miliseconds
      item: JSON.stringify(items),
      embed_data: JSON.stringify(embedDataZalo),
      amount: 5000,
      description: `Lazada - Payment for the order #${transID}`,
      callback_url: configZalo.callbackUrl,
      bank_code: "",
      mac: "",
    };

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
    console.log("mac =", mac);

    // kiểm tra callback hợp lệ (đến từ ZaloPay server)
    if (reqMac !== mac) {
      // callback không hợp lệ
      throw new BadRequestError("mac not equal");
    } else {
      // thanh toán thành công
      // merchant cập nhật trạng thái cho đơn hàng ở đây
      let dataJson = JSON.parse(dataStr);
      console.log(
        "update order's status = success where app_trans_id =",
        dataJson["app_trans_id"]
      );
      result.return_code = 1;
      result.return_message = "success";
      result.data = dataJson;
      console.log(result);
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
      return rs.data;
    } catch (error) {
      throw new BadRequestError("Fetch zalo to query status get error!");
    }
  }
}
export default PaymentSrv;
