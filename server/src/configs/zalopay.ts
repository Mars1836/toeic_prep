const publishOrigin = "https://faad-42-118-128-48.ngrok-free.app";
export const configZalo = {
  app_id: "2553",
  key1: "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
  key2: "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz",
  endpointCreate: "https://sb-openapi.zalopay.vn/v2/create",
  endpointQuery: "https://sb-openapi.zalopay.vn/v2/query",
  callbackUrl: `${publishOrigin}/api/pub/payment/callback`,
};
export const embedDataZalo = {
  redirectUrl: "http://localhost:3000",
};
