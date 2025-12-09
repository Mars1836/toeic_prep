import { constEnv } from "../../configs/const";

export interface SecurityAlertData {
  userName: string;
  loginTime: string;
  location: string;
  device: string;
  browser: string;
  os: string;
  ip: string;
  verificationCode?: string; // OTP để verify login
  reasons: string[];
  riskLevel: "low" | "medium" | "high";
  tokenId?: string; // Token ID để xác nhận/reject login
}

export const securityAlertTemplate = (data: SecurityAlertData) => {
  const riskColors = {
    low: "#4CAF50",
    medium: "#FF9800",
    high: "#F44336",
  };

  const riskLabels = {
    low: "Low Risk",
    medium: "Medium Risk",
    high: "High Risk",
  };

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Security Alert - Unusual Login Activity</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .email-container {
      max-width: 600px;
      margin: 50px auto;
      background-color: #fff;
      padding: 20px;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
    }
    .alert-header {
      background-color: #ff5252;
      color: white;
      padding: 15px;
      border-radius: 5px 5px 0 0;
      text-align: center;
    }
    .alert-header h1 {
      margin: 0;
      font-size: 24px;
    }
    .risk-badge {
      display: inline-block;
      padding: 5px 15px;
      border-radius: 20px;
      color: white;
      font-weight: bold;
      font-size: 14px;
      margin: 10px 0;
    }
    .content {
      padding: 20px;
    }
    p {
      font-size: 16px;
      color: #555;
      line-height: 1.6;
    }
    .info-box {
      background-color: #f9f9f9;
      border-left: 4px solid #2196F3;
      padding: 15px;
      margin: 20px 0;
    }
    .info-box h3 {
      margin-top: 0;
      color: #333;
      font-size: 18px;
    }
    .info-item {
      display: flex;
      margin: 8px 0;
    }
    .info-label {
      font-weight: bold;
      color: #333;
      min-width: 120px;
    }
    .info-value {
      color: #555;
      flex: 1;
    }
    .warning-box {
      background-color: #fff3cd;
      border-left: 4px solid #ffc107;
      padding: 15px;
      margin: 20px 0;
    }
    .warning-box ul {
      margin: 10px 0;
      padding-left: 20px;
    }
    .warning-box li {
      color: #856404;
      margin: 5px 0;
    }
    .verification-box {
      background-color: #e3f2fd;
      border: 2px solid #2196F3;
      padding: 20px;
      margin: 20px 0;
      text-align: center;
      border-radius: 5px;
    }
    .verification-code {
      font-size: 32px;
      font-weight: bold;
      color: #2196F3;
      letter-spacing: 5px;
      margin: 15px 0;
    }
    .button-container {
      text-align: center;
      margin: 20px 0;
    }
    .button {
      display: inline-block;
      padding: 12px 30px;
      text-decoration: none;
      border-radius: 5px;
      font-size: 16px;
      font-weight: 600;
      margin: 5px;
    }
    .button-primary {
      background-color: #4CAF50;
      color: white;
    }
    .button-primary:hover {
      background-color: #45a049;
    }
    .button-danger {
      background-color: #f44336;
      color: white;
    }
    .button-danger:hover {
      background-color: #da190b;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      font-size: 12px;
      color: #777;
      border-top: 1px solid #e0e0e0;
      padding-top: 15px;
    }
    .footer a {
      color: #2196F3;
      text-decoration: none;
    }
    .security-tips {
      background-color: #f5f5f5;
      padding: 15px;
      margin: 20px 0;
      border-radius: 5px;
    }
    .security-tips h4 {
      margin-top: 0;
      color: #333;
    }
    .security-tips ul {
      margin: 10px 0;
      padding-left: 20px;
    }
    .security-tips li {
      color: #666;
      margin: 5px 0;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="alert-header">
      <h1>🔒 Security Alert</h1>
      <p style="margin: 5px 0;">Unusual Login Activity Detected</p>
    </div>
    
    <div class="content">
      <div style="text-align: center;">
        <span class="risk-badge" style="background-color: ${riskColors[data.riskLevel]}">
          ${riskLabels[data.riskLevel]}
        </span>
      </div>

      <p>Hello <strong>${data.userName}</strong>,</p>
      
      <p>We detected a login to your TOEIC Prep account from a device or location we don't recognize.</p>

      <div class="info-box">
        <h3>📍 Login Details</h3>
        <div class="info-item">
          <span class="info-label">Time:</span>
          <span class="info-value">${data.loginTime}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Location:</span>
          <span class="info-value">${data.location}</span>
        </div>
        <div class="info-item">
          <span class="info-label">IP Address:</span>
          <span class="info-value">${data.ip}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Device:</span>
          <span class="info-value">${data.device}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Browser:</span>
          <span class="info-value">${data.browser}</span>
        </div>
        <div class="info-item">
          <span class="info-label">OS:</span>
          <span class="info-value">${data.os}</span>
        </div>
      </div>

      ${
        data.reasons.length > 0
          ? `
      <div class="warning-box">
        <h3>⚠️ Why This Login Looks Suspicious:</h3>
        <ul>
          ${data.reasons.map((reason) => `<li>${reason}</li>`).join("")}
        </ul>
      </div>
      `
          : ""
      }

      ${
        data.verificationCode
          ? `
      <div class="verification-box">
        <h3>🔐 Verification Required</h3>
        <p>To confirm this login, please use the following verification code:</p>
        <div class="verification-code">${data.verificationCode}</div>
        <p style="font-size: 14px; color: #666;">This code will expire in 10 minutes.</p>
      </div>
      `
          : ""
      }

      <h3 style="color: #333; margin-top: 30px;">Was this you?</h3>
      
      <div class="button-container">
        ${
          data.tokenId
            ? `
        <a href="${constEnv.clientOrigin}/account/security/confirm?tokenId=${data.tokenId}" class="button button-primary">
          ✓ Yes, this was me
        </a>
        <a href="${constEnv.clientOrigin}/account/security/reject?tokenId=${data.tokenId}" class="button button-danger">
          ✗ No, secure my account
        </a>
        `
            : `
        <a href="${constEnv.clientOrigin}/account/security" class="button button-primary">
          ✓ Yes, this was me
        </a>
        <a href="${constEnv.clientOrigin}/account/security/secure-account" class="button button-danger">
          ✗ No, secure my account
        </a>
        `
        }
      </div>

      <div class="security-tips">
        <h4>🛡️ Security Tips:</h4>
        <ul>
          <li>Never share your password with anyone</li>
          <li>Use a strong, unique password for your account</li>
          <li>Enable Two-Factor Authentication (2FA) for extra security</li>
          <li>Be cautious of phishing emails asking for your credentials</li>
          <li>Review your login history regularly</li>
        </ul>
      </div>

      <p style="margin-top: 20px; font-size: 14px; color: #666;">
        If you didn't attempt to log in, please change your password immediately and contact our support team.
      </p>
    </div>

    <div class="footer">
      <p>This is an automated security alert from <strong>TOEIC Prep</strong></p>
      <p>
        <a href="${constEnv.clientOrigin}/account/security">Security Settings</a> | 
        <a href="${constEnv.clientOrigin}/support">Contact Support</a> | 
        <a href="${constEnv.clientOrigin}/privacy">Privacy Policy</a>
      </p>
      <p style="margin-top: 10px;">
        © ${new Date().getFullYear()} TOEIC Prep. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
`;
};

