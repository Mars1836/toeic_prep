export const originUrl = "http://localhost:4000/api/user";
const auth = {
  localSignupCache: originUrl + "/auth/local-signup-cache",
  login: originUrl + "/auth/login",
  logout: originUrl + "/auth/logout",
  currentUser: originUrl + "/auth/getinfor",
  googleLogin: originUrl + "/auth/google-login",
  fbLogin: originUrl + "/auth/facebook-login",
  sendResetPwEmail: originUrl + "/auth/otp/reset-password",
  requestResetPw: originUrl + "/auth/request/reset-password",
  sendVerifyEmail: originUrl + "/auth/otp/verify-email",
  requestVerifyEmail: originUrl + "/auth/request/verify-email",
};

export const endpoint = { auth };
