<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Test Email - {{ $clinic_name }}</title>
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
            background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
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
        .test-info {
            background-color: #E8F5E8;
            padding: 15px;
            border-radius: 5px;
            margin: 15px 0;
            border: 1px solid #4CAF50;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            color: #666;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Test Email</h1>
        </div>
        
        <div class="content">
            <h2>Email Configuration Test</h2>
            
            <p>{{ $test_message }}</p>
            
            <div class="test-info">
                <h3>Test Information:</h3>
                <ul>
                    <li><strong>Timestamp:</strong> {{ $timestamp }}</li>
                    <li><strong>Email Provider:</strong> Mailjet</li>
                    <li><strong>Status:</strong> Test Email Sent Successfully</li>
                </ul>
            </div>
            
            <p>If you received this email, your Mailjet configuration is working correctly!</p>
            
            <p>Best regards,<br>
            The {{ $clinic_name }} Team</p>
        </div>
        
        <div class="footer">
            <p>This is a test email from the {{ $clinic_name }}.<br>
            Please do not reply to this email.</p>
        </div>
    </div>
</body>
</html> 