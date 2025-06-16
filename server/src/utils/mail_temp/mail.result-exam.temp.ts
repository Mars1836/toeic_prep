export const resultExamTemplate = (data: {
  name: string;
  certificate?: {
    transactionHash: string;
    blockNumber: number;
    cid: string;
    url: string;
  };
}) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Kết quả bài thi TOEIC</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          text-align: center;
          padding: 20px 0;
          background-color: #f8f9fa;
          border-radius: 5px;
          margin-bottom: 20px;
        }
        .content {
          background-color: #ffffff;
          padding: 20px;
          border-radius: 5px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .certificate-info {
          margin-top: 20px;
          padding: 15px;
          background-color: #f8f9fa;
          border-radius: 5px;
        }
        .certificate-info p {
          margin: 5px 0;
        }
        .certificate-link {
          display: inline-block;
          margin-top: 10px;
          color: #007bff;
          text-decoration: none;
        }
        .certificate-link:hover {
          text-decoration: underline;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Kết quả bài thi TOEIC</h1>
      </div>
      <div class="content">
        <p>Xin chào <strong>${data.name}</strong>,</p>
        <p>Chúng tôi xin thông báo kết quả bài thi TOEIC của bạn:</p>
        ${
          data.certificate
            ? `
        <div class="certificate-info">
          <h3>Thông tin chứng chỉ:</h3>
          <p><strong>Mã giao dịch:</strong> ${data.certificate.transactionHash}</p>
          <p><strong>Số khối:</strong> ${data.certificate.blockNumber}</p>
          <p><strong>CID:</strong> ${data.certificate.cid}</p>
          <a href="${data.certificate.url}" class="certificate-link" target="_blank">Xem chứng chỉ</a>
          <br>
          <a href="http://localhost:3003/" class="certificate-link" target="_blank">Kiểm tra chứng chỉ trên DApp</a>
        </div>
        `
            : ""
        }
        <p>Chúc bạn một ngày tốt lành!</p>
      </div>
    </body>
    </html>
  `;
};
