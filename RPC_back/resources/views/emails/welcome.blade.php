<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Welcome to {{ $clinic_name }}</title>
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
        .welcome-message {
            background-color: #e8f5e8;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border: 1px solid #4caf50;
        }
        .login-info {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #4caf50;
        }
        .login-info h3 {
            margin-top: 0;
            color: #4caf50;
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
        .footer {
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            color: #666;
            font-size: 14px;
        }
        .cta-button {
            display: inline-block;
            background-color: #4caf50;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
            font-weight: bold;
        }
        .cta-button:hover {
            background-color: #45a049;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to {{ $clinic_name }}</h1>
            <p>Your account has been created successfully!</p>
        </div>
        
        <div class="content">
            <h2>Hello {{ $name }},</h2>
            
            <div class="welcome-message">
                <p>Welcome to the {{ $clinic_name }}! We're excited to have you as part of our community.</p>
                <p>Your account has been successfully created and you can now access all our services.</p>
            </div>
            
            <div class="login-info">
                <h3>Your Account Information</h3>
                <div class="info-row">
                    <span class="label">Name:</span>
                    <span class="value">{{ $name }}</span>
                </div>
                <div class="info-row">
                    <span class="label">Email:</span>
                    <span class="value">{{ $email }}</span>
                </div>
                @if($password)
                <div class="info-row">
                    <span class="label">Password:</span>
                    <span class="value">{{ $password }}</span>
                </div>
                @endif
                <div class="info-row">
                    <span class="label">Account Created:</span>
                    <span class="value">{{ now()->format('Y-m-d H:i:s') }}</span>
                </div>
            </div>
            
            <p>You can now:</p>
            <ul>
                <li>Book appointments for your pets</li>
                <li>View your appointment history</li>
                <li>Access your pet's medical records</li>
                <li>Receive important notifications</li>
            </ul>
            
            <p>If you have any questions or need assistance, please don't hesitate to contact us.</p>
            
            <p>Best regards,<br>
            <strong>{{ $clinic_name }} Team</strong></p>
        </div>
        
        <div class="footer">
            <p>This email was sent from the {{ $clinic_name }}.<br>
            Please keep your login credentials secure.</p>
        </div>
    </div>
</body>
</html> 