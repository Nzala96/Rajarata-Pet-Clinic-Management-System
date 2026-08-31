<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Invoice Alert - {{ $clinic_name }}</title>
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
            background: linear-gradient(135deg, #9c27b0 0%, #673ab7 100%);
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
        .invoice-details {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #9c27b0;
        }
        .invoice-details h3 {
            margin-top: 0;
            color: #9c27b0;
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
        .total-amount {
            background-color: #e1bee7;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            text-align: center;
            font-size: 24px;
            font-weight: bold;
            color: #7b1fa2;
        }
        .payment-options {
            background-color: #f3e5f5;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border: 1px solid #ce93d8;
        }
        .payment-options h3 {
            margin-top: 0;
            color: #7b1fa2;
        }
        .payment-options ul {
            margin: 10px 0;
            padding-left: 20px;
        }
        .payment-options li {
            margin: 8px 0;
        }
        .important-notice {
            background-color: #fff3e0;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
            border: 1px solid #ffb74d;
        }
        .important-notice h3 {
            margin-top: 0;
            color: #f57c00;
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
            <h1>Invoice Alert</h1>
            <p>Your invoice is ready for payment</p>
        </div>
        
        <div class="content">
            <h2>Hello {{ $owner_name }},</h2>
            
            <p>Your invoice has been generated and is ready for payment. Please review the details below.</p>
            
            <div class="invoice-details">
                <h3>Invoice Details</h3>
                <div class="detail-row">
                    <span class="label">Invoice Number:</span>
                    <span class="value">#{{ $invoice_number }}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Date:</span>
                    <span class="value">{{ $invoice->created_at ?? now()->format('Y-m-d') }}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Due Date:</span>
                    <span class="value">{{ $invoice->due_date ?? now()->addDays(30)->format('Y-m-d') }}</span>
                </div>
            </div>
            
            <div class="total-amount">
                Total Amount: Rs.{{ number_format($total_amount, 2) }}
            </div>
            
            <div class="payment-options">
                <h3>Payment Options</h3>
                <ul>
                    <li><strong>Online Payment:</strong> Pay securely through your online account</li>
                    <li><strong>Credit/Debit Card:</strong> Accepted at the clinic</li>
                    <li><strong>Bank Transfer:</strong> Contact us for bank details</li>
                    <li><strong>Cash Payment:</strong> Pay in person at the clinic</li>
                </ul>
            </div>
            
            <div class="important-notice">
                <h3>Important Information</h3>
                <ul>
                    <li>Payment is due within 30 days of invoice date</li>
                    <li>Late payments may incur additional fees</li>
                    <li>Please include your invoice number when making payment</li>
                    <li>Contact us if you need to discuss payment arrangements</li>
                </ul>
            </div>
            
            <div class="contact-info">
                <p><strong>Questions about this invoice?</strong></p>
                <p>Email: rpc@gmail.com</p>
                <p>Please include your invoice number in your message.</p>
            </div>
            
            <p>Thank you for choosing our services!</p>
            
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