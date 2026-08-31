# Email Troubleshooting Guide

If you can't send emails, follow this step-by-step guide to identify and fix the issue.

## Step 1: Check if you have a .env file

The most common issue is missing or incorrect `.env` file configuration.

### Create or update your .env file:

1. Create a `.env` file in your `RPC_back` directory
2. Add the following configuration:

```env
APP_NAME="Pet Clinic Management System"
APP_ENV=local
APP_KEY=base64:your_generated_key_here
APP_DEBUG=true
APP_URL=http://localhost:8000

# Mail Configuration for Mailjet
MAIL_MAILER=mailjet
MAIL_HOST=in-v3.mailjet.com
MAIL_PORT=587
MAIL_USERNAME=your_actual_mailjet_api_key
MAIL_PASSWORD=your_actual_mailjet_secret_key
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=your_verified_sender@yourdomain.com
MAIL_FROM_NAME="Pet Clinic Management System"

# Mailjet Configuration
MAILJET_HOST=in-v3.mailjet.com
MAILJET_PORT=587
MAILJET_ENCRYPTION=tls
MAILJET_USERNAME=your_actual_mailjet_api_key
MAILJET_PASSWORD=your_actual_mailjet_secret_key
```

## Step 2: Get your Mailjet credentials

1. Sign up at https://www.mailjet.com
2. Go to Account Settings > API Keys
3. Copy your API Key and Secret Key
4. Replace `your_actual_mailjet_api_key` and `your_actual_mailjet_secret_key` in your .env file

## Step 3: Verify your sender

1. In Mailjet, go to Senders & Domains
2. Add and verify your sender email address
3. Use this verified email as your `MAIL_FROM_ADDRESS`

## Step 4: Test your configuration

Run this command to test your email configuration:

```bash
php artisan email:test your-email@example.com
```

This will show you:
- Your current mail configuration
- Any errors that occur
- Whether the email was sent successfully

## Step 5: Common Issues and Solutions

### Issue 1: "No .env file found"
**Solution:** Create a `.env` file in your `RPC_back` directory

### Issue 2: "Application key not set"
**Solution:** Run `php artisan key:generate`

### Issue 3: "Authentication failed"
**Solutions:**
- Check your Mailjet API credentials
- Ensure your account is active
- Verify your sender email is verified in Mailjet

### Issue 4: "Sender not verified"
**Solution:** Verify your sender email/domain in Mailjet dashboard

### Issue 5: "Connection timeout"
**Solutions:**
- Check your internet connection
- Verify Mailjet host and port settings
- Check if your firewall is blocking the connection

### Issue 6: "Template not found"
**Solution:** The email templates are already created in `resources/views/emails/`

## Step 6: Test via API

Once your configuration is working, test via the API:

```bash
curl -X POST http://localhost:8000/api/email/test \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"email": "test@example.com"}'
```

## Step 7: Check Logs

If emails still don't work, check the logs:

```bash
tail -f storage/logs/laravel.log
```

## Quick Fix Checklist

- [ ] Do you have a `.env` file?
- [ ] Is your `APP_KEY` set?
- [ ] Are your Mailjet credentials correct?
- [ ] Is your sender email verified in Mailjet?
- [ ] Are you using the correct mail driver (`mailjet`)?
- [ ] Is your server connected to the internet?

## Alternative: Use Log Driver for Testing

If you want to test without sending actual emails, temporarily change your mail driver to `log`:

```env
MAIL_MAILER=log
```

This will log emails to `storage/logs/laravel.log` instead of sending them.

## Still Having Issues?

1. Check the Laravel logs: `storage/logs/laravel.log`
2. Check Mailjet dashboard for delivery reports
3. Verify your Mailjet account status
4. Contact Mailjet support if needed

## Test Command Output

When you run `php artisan email:test your-email@example.com`, you should see:

```
Testing email configuration...
Target email: your-email@example.com
Mail driver: mailjet
Mail host: in-v3.mailjet.com
Mail port: 587
Mail username: your_api_key
Mail from address: your_verified_sender@yourdomain.com
Mail from name: Pet Clinic Management System
✅ Email sent successfully!
```

If you see errors, they will help identify the specific issue. 