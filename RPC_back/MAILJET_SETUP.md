# Mailjet Setup Guide for Pet Clinic Management System

This guide will help you configure Mailjet for sending emails in your Pet Clinic Management System.

## Prerequisites

1. A Mailjet account (sign up at https://www.mailjet.com)
2. A verified sender domain or email address
3. Your Mailjet API credentials

## Configuration Steps

### 1. Get Your Mailjet Credentials

1. Log in to your Mailjet account
2. Go to Account Settings > API Keys
3. Note down your:
   - API Key (Username)
   - Secret Key (Password)

### 2. Configure Your .env File

Create or update your `.env` file with the following settings:

```env
# Mail Configuration
MAIL_MAILER=mailjet
MAIL_HOST=in-v3.mailjet.com
MAIL_PORT=587
MAIL_USERNAME=your_mailjet_api_key
MAIL_PASSWORD=your_mailjet_secret_key
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=your_verified_sender@yourdomain.com
MAIL_FROM_NAME="Pet Clinic Management System"

# Mailjet Configuration
MAILJET_HOST=in-v3.mailjet.com
MAILJET_PORT=587
MAILJET_ENCRYPTION=tls
MAILJET_USERNAME=your_mailjet_api_key
MAILJET_PASSWORD=your_mailjet_secret_key
```

### 3. Verify Your Sender

1. In Mailjet, go to Senders & Domains
2. Add and verify your sender email address or domain
3. Use this verified email as your `MAIL_FROM_ADDRESS`

### 4. Test Your Configuration

You can test your email configuration using the API endpoint:

```bash
curl -X POST http://localhost:8000/api/email/test \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"email": "test@example.com"}'
```

## Available Email Types

The system includes the following email templates:

### Admin to User Emails:
1. **Appointment Confirmation** - Sent when appointments are confirmed
2. **Appointment Reminder** - Sent as appointment reminders
3. **Invoice Alert** - Sent with invoice details and PDF attachment

### User to Admin Emails:
4. **User Contact** - Users can send messages to rpc@gmail.com

### System Emails:
5. **Welcome Email** - Sent to new users
6. **Password Reset** - Sent for password reset requests

## API Endpoints

### Admin Functions (Protected Routes):
- `POST /api/email/test` - Test email configuration
- `POST /api/email/appointment-confirmation` - Send appointment confirmation
- `POST /api/email/appointment-reminder` - Send appointment reminder
- `POST /api/email/invoice-alert` - Send invoice alert
- `POST /api/email/welcome` - Send welcome email
- `POST /api/email/password-reset` - Send password reset email

### User Functions (Protected Routes):
- `POST /api/email/user-to-admin` - Send message to admin (rajaratapetclinic@gmail.com)

## Usage Examples

### Testing Email Configuration
```javascript
fetch('/api/email/test', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
  },
  body: JSON.stringify({
    email: 'test@example.com'
  })
});
```

### Sending Appointment Confirmation (Admin)
```javascript
fetch('/api/email/appointment-confirmation', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
  },
  body: JSON.stringify({
    appointment_id: 1
  })
});
```

### Sending Invoice Alert (Admin)
```javascript
fetch('/api/email/invoice-alert', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
  },
  body: JSON.stringify({
    invoice_id: 1,
    pdf_path: '/path/to/invoice.pdf' // Optional
  })
});
```

### User Sending Message to Admin
```javascript
fetch('/api/email/user-to-admin', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
  },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    subject: 'Appointment Question',
    message: 'I have a question about my appointment...'
  })
});
```

## Email Templates

The system includes beautiful, responsive email templates:

1. **appointment-confirmation.blade.php** - Professional appointment confirmation
2. **appointment-reminder.blade.php** - Friendly appointment reminders
3. **invoice-alert.blade.php** - Invoice notifications with payment options
4. **user-to-admin.blade.php** - User contact form to admin
5. **welcome.blade.php** - Welcome emails for new users
6. **password-reset.blade.php** - Password reset requests

## Features

- **Professional Design**: All templates are responsive and professionally designed
- **PDF Attachments**: Invoice emails can include PDF attachments
- **Reply-to Functionality**: User-to-admin emails set proper reply-to addresses
- **Error Handling**: Comprehensive error handling and logging
- **Security**: All endpoints are protected with authentication

## Troubleshooting

### Common Issues

1. **Authentication Failed**
   - Verify your API key and secret key
   - Ensure your account is active

2. **Sender Not Verified**
   - Verify your sender email/domain in Mailjet
   - Use only verified senders

3. **Emails Not Delivered**
   - Check your Mailjet dashboard for delivery status
   - Verify recipient email addresses
   - Check spam folders

4. **Rate Limiting**
   - Mailjet has rate limits based on your plan
   - Monitor your usage in the dashboard

### Logs

Email sending logs are stored in Laravel's log files. Check:
- `storage/logs/laravel.log` for detailed error messages
- Mailjet dashboard for delivery reports

## Security Notes

1. Never commit your `.env` file to version control
2. Keep your API credentials secure
3. Use environment variables for all sensitive data
4. Regularly rotate your API keys

## Support

For Mailjet support:
- Visit: https://www.mailjet.com/support
- Email: support@mailjet.com

For application-specific issues, check the Laravel logs and Mailjet dashboard.

## Admin Email Address

The system is configured to send user contact emails to: **rpc@gmail.com**

This email address is hardcoded in the system for user-to-admin communication. Users can send messages to this address through the contact form. 