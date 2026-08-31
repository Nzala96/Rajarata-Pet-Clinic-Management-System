<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>User Contact - {{ $clinic_name }}</title>
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
        .user-info {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #4caf50;
        }
        .user-info h3 {
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
        .message-content {
            background-color: #e8f5e8;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border: 1px solid #4caf50;
        }
        .message-content h3 {
            margin-top: 0;
            color: #2e7d32;
        }
        .message-text {
            background-color: white;
            padding: 15px;
            border-radius: 5px;
            border: 1px solid #ddd;
            margin-top: 10px;
        }
        .footer {
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            color: #666;
            font-size: 14px;
        }
        .reply-info {
            margin-top: 20px;
            padding: 15px;
            background-color: #fff3e0;
            border-radius: 5px;
            border: 1px solid #ffb74d;
        }
        .reply-info p {
            margin: 5px 0;
            color: #f57c00;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>User Contact Message</h1>
            <p>A user has sent you a message</p>
        </div>
        
        <div class="content">
            <h2>Hello Admin,</h2>
            
            <p>A user has contacted you through the {{ $clinic_name }} system. Here are the details:</p>
            
            <div class="user-info">
                <h3>User Information</h3>
                <div class="info-row">
                    <span class="label">Name:</span>
                    <span class="value">{{ $user_name }}</span>
                </div>
                <div class="info-row">
                    <span class="label">Email:</span>
                    <span class="value">{{ $user_email }}</span>
                </div>
                <div class="info-row">
                    <span class="label">Subject:</span>
                    <span class="value">{{ $subject }}</span>
                </div>
                <div class="info-row">
                    <span class="label">Date:</span>
                    <span class="value">{{ now()->format('Y-m-d H:i:s') }}</span>
                </div>
            </div>
            
            <div class="message-content">
                <h3>Message</h3>
                <div class="message-text">
                    {!! nl2br(e($user_message)) !!}
                </div>
            </div>
            
            <div class="reply-info">
                <p><strong>To reply to this user:</strong></p>
                <p>Simply reply to this email. The user's email address ({{ $user_email }}) has been set as the reply-to address.</p>
            </div>
            
            <p>Please respond to this user as soon as possible.</p>
            
            <p>Best regards,<br>
            <strong>{{ $clinic_name }} System</strong></p>
        </div>
        
        <div class="footer">
            <p>This email was sent from the {{ $clinic_name }}.<br>
            You can reply directly to this email to respond to the user.</p>
        </div>
    </div>
</body>
</html> 