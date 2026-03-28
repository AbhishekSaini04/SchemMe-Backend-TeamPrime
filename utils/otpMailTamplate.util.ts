export const otpEmailTemplate = (otp: string): string => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>OTP Verification</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 50px auto;
          background-color: #ffffff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          color: #333;
          margin-bottom: 30px;
        }
        .header h1 {
          color: #007bff;
          margin: 0;
        }
        .content {
          text-align: center;
          color: #555;
          line-height: 1.6;
        }
        .otp {
          font-size: 32px;
          font-weight: bold;
          color: #007bff;
          letter-spacing: 2px;
          margin: 20px 0;
          padding: 15px;
          background-color: #f9f9f9;
          border-radius: 4px;
        }
        .footer {
          text-align: center;
          color: #999;
          font-size: 12px;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #eee;
        }
        .warning {
          color: #d32f2f;
          font-size: 14px;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>OTP Verification</h1>
        </div>
        <div class="content">
          <p>Hello,</p>
          <p>Your One-Time Password (OTP) for registration is:</p>
          <div class="otp">${otp}</div>
          <p>This OTP is valid for 10 minutes. Do not share it with anyone.</p>
          <div class="warning">
            <strong>Note:</strong> If you didn't request this OTP, please ignore this email.
          </div>
        </div>
        <div class="footer">
          <p>&copy; 2026 SchemMe. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
