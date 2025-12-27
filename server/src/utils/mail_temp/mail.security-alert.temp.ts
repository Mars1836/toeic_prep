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
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Security Alert</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: #f5f5f5;
      margin: 0;
      padding: 20px;
      line-height: 1.6;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
    }
    .header {
      background-color: #2c3e50;
      color: #ffffff;
      padding: 30px 40px;
      border-radius: 4px 4px 0 0;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }
    .header p {
      margin: 8px 0 0 0;
      font-size: 14px;
      color: #ecf0f1;
    }
    .content {
      padding: 40px;
      color: #333333;
    }
    .greeting {
      font-size: 16px;
      margin-bottom: 20px;
    }
    .section {
      margin: 30px 0;
    }
    .section-title {
      font-size: 14px;
      font-weight: 600;
      color: #555555;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 15px;
      border-bottom: 1px solid #e0e0e0;
      padding-bottom: 8px;
    }
    .info-grid {
      background-color: #fafafa;
      border: 1px solid #e8e8e8;
      border-radius: 4px;
      padding: 20px;
    }
    .info-row {
      display: flex;
      padding: 8px 0;
      border-bottom: 1px solid #f0f0f0;
    }
    .info-row:last-child {
      border-bottom: none;
    }
    .info-label {
      font-weight: 500;
      color: #666666;
      min-width: 100px;
      font-size: 14px;
    }
    .info-value {
      color: #333333;
      font-size: 14px;
    }
    .reasons-list {
      background-color: #fafafa;
      border-left: 3px solid #95a5a6;
      padding: 15px 20px;
      margin: 15px 0;
    }
    .reasons-list ul {
      margin: 0;
      padding-left: 20px;
    }
    .reasons-list li {
      color: #555555;
      margin: 8px 0;
      font-size: 14px;
    }
    .action-section {
      margin: 40px 0;
      text-align: center;
    }
    .action-title {
      font-size: 16px;
      font-weight: 600;
      color: #333333;
      margin-bottom: 20px;
    }
    .button-group {
      display: flex;
      gap: 15px;
      justify-content: center;
      flex-wrap: wrap;
    }
    .button {
      display: inline-block;
      padding: 12px 30px;
      text-decoration: none;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 500;
      transition: background-color 0.2s;
    }
    .button-confirm {
      background-color: #34495e;
      color: #ffffff;
      border: 1px solid #2c3e50;
    }
    .button-reject {
      background-color: #ffffff;
      color: #e74c3c;
      border: 1px solid #e74c3c;
    }
    .tips {
      background-color: #f8f9fa;
      border: 1px solid #e9ecef;
      border-radius: 4px;
      padding: 20px;
      margin: 30px 0;
    }
    .tips-title {
      font-size: 14px;
      font-weight: 600;
      color: #555555;
      margin: 0 0 12px 0;
    }
    .tips ul {
      margin: 0;
      padding-left: 20px;
    }
    .tips li {
      color: #666666;
      font-size: 13px;
      margin: 6px 0;
    }
    .footer {
      background-color: #f8f9fa;
      padding: 25px 40px;
      text-align: center;
      border-top: 1px solid #e0e0e0;
      border-radius: 0 0 4px 4px;
    }
    .footer p {
      margin: 8px 0;
      font-size: 12px;
      color: #777777;
    }
    .footer a {
      color: #3498db;
      text-decoration: none;
    }
    .footer a:hover {
      text-decoration: underline;
    }
    .divider {
      height: 1px;
      background-color: #e0e0e0;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Security Alert</h1>
      <p>Unusual login activity detected on your account</p>
    </div>
    
    <div class="content">
      <div class="greeting">
        Hello <strong>${data.userName}</strong>,
      </div>
      
      <p>We detected a login to your TOEIC Prep account from a device or location we don't recognize.</p>

      <div class="section">
        <div class="section-title">Login Details</div>
        <div class="info-grid">
          <div class="info-row">
            <span class="info-label">Time:</span>
            <span class="info-value">${data.loginTime}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Location:</span>
            <span class="info-value">${data.location}</span>
          </div>
          <div class="info-row">
            <span class="info-label">IP Address:</span>
            <span class="info-value">${data.ip}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Device:</span>
            <span class="info-value">${data.device}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Browser:</span>
            <span class="info-value">${data.browser}</span>
          </div>
          <div class="info-row">
            <span class="info-label">OS:</span>
            <span class="info-value">${data.os}</span>
          </div>
        </div>
      </div>

      ${
        data.reasons.length > 0
          ? `
      <div class="section">
        <div class="section-title">Why This Login Looks Suspicious</div>
        <div class="reasons-list">
          <ul>
            ${data.reasons.map((reason) => `<li>${reason}</li>`).join("")}
          </ul>
        </div>
      </div>
      `
          : ""
      }

      <div class="divider"></div>

      <div class="action-section">
        <div class="action-title">Was this you?</div>
        <div class="button-group">
          ${
            data.tokenId
              ? `
          <a href="${constEnv.clientOrigin}/account/security/confirm?tokenId=${data.tokenId}" class="button button-confirm">
            Yes, this was me
          </a>
          <a href="${constEnv.clientOrigin}/account/security/reject?tokenId=${data.tokenId}" class="button button-reject">
            No, secure my account
          </a>
          `
              : `
          <a href="${constEnv.clientOrigin}/account/security" class="button button-confirm">
            Yes, this was me
          </a>
          <a href="${constEnv.clientOrigin}/account/security/secure-account" class="button button-reject">
            No, secure my account
          </a>
          `
          }
        </div>
      </div>

      <div class="tips">
        <div class="tips-title">Security Recommendations</div>
        <ul>
          <li>Never share your password with anyone</li>
          <li>Use a strong, unique password for your account</li>
          <li>Enable Two-Factor Authentication for extra security</li>
          <li>Be cautious of phishing emails</li>
          <li>Review your login history regularly</li>
        </ul>
      </div>

      <p style="font-size: 13px; color: #777777; margin-top: 30px;">
        If you didn't attempt to log in, please change your password immediately and contact our support team.
      </p>
    </div>

    <div class="footer">
      <p><strong>TOEIC Prep</strong> - Automated Security Alert</p>
      <p>
        <a href="${constEnv.clientOrigin}/account/security">Security Settings</a> | 
        <a href="${constEnv.clientOrigin}/support">Contact Support</a> | 
        <a href="${constEnv.clientOrigin}/privacy">Privacy Policy</a>
      </p>
      <p style="margin-top: 15px;">
        © ${new Date().getFullYear()} TOEIC Prep. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
`;
};

