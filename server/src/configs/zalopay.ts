const publishOrigin =
  "https://33a6-2401-d800-9221-27e-64f3-204c-fa45-6cb5.ngrok-free.app";
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
