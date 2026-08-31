<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Appointment Reminder - {{ $clinic_name }}</title>
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
            background: linear-gradient(135deg, #ff9a56 0%, #ff6b6b 100%);
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
            border-left: 4px solid #ff9a56;
        }
        .appointment-details h3 {
            margin-top: 0;
            color: #ff9a56;
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
            background-color: #fff3e0;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border: 1px solid #ffb74d;
        }
        .reminder-box h3 {
            margin-top: 0;
            color: #f57c00;
        }
        .reminder-box ul {
            margin: 10px 0;
            padding-left: 20px;
        }
        .reminder-box li {
            margin: 5px 0;
        }
        .urgent-notice {
            background-color: #ffebee;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
            border: 1px solid #ffcdd2;
        }
        .urgent-notice h3 {
            margin-top: 0;
            color: #d32f2f;
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
            <h1>Appointment Reminder</h1>
            <p>Don't forget your upcoming appointment</p>
        </div>
        
        <div class="content">
            <h2>Hello {{ $owner_name }},</h2>
            
            <p>This is a friendly reminder about your upcoming appointment with {{ $pet_name }}.</p>
            
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
                    <li>Consider bringing a favorite toy or treat for {{ $pet_name }}</li>
                </ul>
            </div>
            
            <div class="urgent-notice">
                <h3>Need to Reschedule?</h3>
                <p>If you need to reschedule or cancel your appointment, please contact us as soon as possible. Late cancellations may incur a fee.</p>
            </div>
            
            <div class="contact-info">
                <p><strong>Contact Information:</strong></p>
                <p>Email: rajaratapetclinic@gmail.com</p>
                <p>Please include your appointment details when contacting us.</p>
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