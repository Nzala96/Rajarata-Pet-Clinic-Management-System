<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Appointment Confirmation - {{ $clinic_name }}</title>
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
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
        .appointment-details {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #667eea;
        }
        .appointment-details h3 {
            margin-top: 0;
            color: #667eea;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            margin: 10px 0;
            padding: 8px 0;
            border-bottom: 1px solid #eee;
        }
        .detail-row:last-child {
            border-bottom: none;
        }
        .label {
            font-weight: bold;
            color: #555;
        }
        .value {
            color: #333;
        }
        .reminder-box {
            background-color: #e3f2fd;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border: 1px solid #2196f3;
        }
        .reminder-box h3 {
            margin-top: 0;
            color: #1976d2;
        }
        .reminder-box ul {
            margin: 10px 0;
            padding-left: 20px;
        }
        .reminder-box li {
            margin: 5px 0;
        }
        .footer {
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            color: #666;
            font-size: 14px;
        }
        .contact-info {
            margin-top: 20px;
            padding: 15px;
            background-color: #f8f9fa;
            border-radius: 5px;
        }
        .contact-info p {
            margin: 5px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Appointment Confirmed</h1>
            <p>Your appointment has been successfully scheduled</p>
        </div>
        
        <div class="content">
            <h2>Hello {{ $owner_name }},</h2>
            
            <p>Great news! Your appointment has been confirmed and is now scheduled. Here are all the details:</p>
            
            <div class="appointment-details">
                <h3>Appointment Details</h3>
                <div class="detail-row">
                    <span class="label">Pet Name:</span>
                    <span class="value">{{ $pet_name }}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Date:</span>
                    <span class="value">{{ $appointment_date }}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Time:</span>
                    <span class="value">{{ $appointment_time }}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Doctor:</span>
                    <span class="value">{{ $doctor_name }}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Service:</span>
                    <span class="value">{{ $service_type }}</span>
                </div>
            </div>
            
            <div class="reminder-box">
                <h3>Important Reminders</h3>
                <ul>
                    <li>Please arrive 10 minutes before your scheduled appointment time</li>
                    <li>Bring any relevant medical records or previous test results</li>
                    <li>If you need to reschedule, please contact us at least 24 hours in advance</li>
                    <li>Make sure {{ $pet_name }} is properly restrained (leash, carrier, etc.)</li>
                </ul>
            </div>
            
            <p>If you have any questions or need to make changes to your appointment, please contact us immediately.</p>
            
            <div class="contact-info">
                <p><strong>Need to reschedule?</strong></p>
                <p>Contact us as soon as possible to make changes to your appointment.</p>
            </div>
            
            <p>We look forward to seeing you and {{ $pet_name }}!</p>
            
            <p>Best regards,<br>
            <strong>The {{ $clinic_name }} Team</strong></p>
        </div>
        
        <div class="footer">
            <p>This email was sent from the {{ $clinic_name }}.<br>
            Please do not reply to this email.</p>
        </div>
    </div>
</body>
</html> 