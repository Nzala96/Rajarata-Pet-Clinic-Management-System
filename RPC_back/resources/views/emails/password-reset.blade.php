<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Password Reset - {{ $clinic_name }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .container {
            background-color: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }
        .header {
            background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 300;
        }
        .content {
            padding: 30px;
        }
        .reset-info {
            background-color: #fff3e0;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border: 1px solid #ffb74d;
        }
        .reset-info h3 {
            margin-top: 0;
            color: #f57c00;
        }
        .cta-button {
            display: inline-block;
            background-color: #4caf50;
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
            font-weight: bold;
            font-size: 16px;
        }
        .cta-button:hover {
            background-color: #45a049;
        }
        .security-notice {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #dc3545;
        }
        .security-notice h3 {
            margin-top: 0;
            color: #dc3545;
        }
        .footer {
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            color: #666;
            font-size: 14px;
        }
        .info-row {
            display: flex;
            justify-content: space-between;
            margin: 10px 0;
            padding: 8px 0;
            border-bottom: 1px solid #eee;
        }
        .info-row:last-child {
            border-bottom: none;
        }
        .label {
            font-weight: bold;
            color: #555;
        }
        .value {
            color: #333;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Password Reset Request</h1>
            <p>{{ $clinic_name }}</p>
        </div>
        
        <div class="content">
            <h2>Hello {{ $name }},</h2>
            
            <p>We received a request to reset your password for your {{ $clinic_name }} account.</p>
            
            <div class="reset-info">
                <h3>Reset Your Password</h3>
                <p>Click the button below to reset your password. This link will expire in 60 minutes for security reasons.</p>
                
                <a href="{{ $reset_url }}" class="cta-button">Reset Password</a>
                
                <p><strong>If the button doesn't work, copy and paste this link into your browser:</strong></p>
                <p style="word-break: break-all; color: #666;">{{ $reset_url }}</p>
            </div>
            
            <div class="security-notice">
                <h3>Security Notice</h3>
                <ul>
                    <li>This password reset link will expire in 60 minutes</li>
                    <li>If you didn't request this password reset, please ignore this email</li>
                    <li>Your password will remain unchanged until you click the link above</li>
                    <li>For security, this link can only be used once</li>
                </ul>
            </div>
            
            <div class="info-row">
                <span class="label">Account Email:</span>
                <span class="value">{{ $email }}</span>
            </div>
            <div class="info-row">
                <span class="label">Request Time:</span>
                <span class="value">{{ now()->format('Y-m-d H:i:s') }}</span>
            </div>
            
            <p>If you have any questions or need assistance, please contact our support team.</p>
            
            <p>Best regards,<br>
            <strong>{{ $clinic_name }} Team</strong></p>
        </div>
        
        <div class="footer">
            <p>This email was sent from the {{ $clinic_name }}.<br>
            Please do not reply to this email. If you need help, contact our support team.</p>
        </div>
    </div>
</body>
</html> 