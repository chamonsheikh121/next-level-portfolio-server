# Email & Queue Setup Guide

## Prerequisites

### 1. Redis Installation (Required for BullMQ)

**Windows:**
```bash
# Using Chocolatey
choco install redis

# Or download from: https://github.com/microsoftarchive/redis/releases
```

**macOS:**
```bash
brew install redis
brew services start redis
```

**Linux:**
```bash
sudo apt-get install redis-server
sudo systemctl start redis
```

**Docker (Recommended):**
```bash
docker run -d -p 6379:6379 --name portfolio-redis redis:alpine
```

### 2. Gmail App Password Setup

To send emails via Gmail, you need to create an App Password:

1. **Enable 2-Factor Authentication:**
   - Go to your Google Account: https://myaccount.google.com/
   - Navigate to Security
   - Enable 2-Step Verification

2. **Create App Password:**
   - Go to: https://myaccount.google.com/apppasswords
   - Select app: "Mail"
   - Select device: "Other (Custom name)" - enter "Portfolio Server"
   - Click "Generate"
   - Copy the 16-character password

3. **Update .env:**
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=xxxx xxxx xxxx xxxx  # The 16-character app password
   ```

## Environment Variables

Add these to your `.env` file:

```env
# Email Configuration (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
EMAIL_FROM="Portfolio <noreply@portfolio.com>"

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
```

## Testing Email System

### 1. Start Redis
```bash
# If using Docker
docker start portfolio-redis

# Or if installed locally
redis-server
```

### 2. Start the Application
```bash
npm run dev
```

### 3. Test Email Sending

**Login (triggers OTP email):**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"sheikhchamon9@gmail.com","password":"Chamonali12!@"}'
```

**Create User (triggers welcome email):**
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"email":"newuser@example.com","name":"New User","password":"Password123!"}'
```

## Email Types

### 1. OTP Email
- **Trigger:** User login or OTP resend
- **Contains:** 6-digit OTP code
- **Expiry:** 10 minutes
- **Template:** Professional HTML email with OTP display

### 2. Welcome Email
- **Trigger:** New user creation
- **Contains:** Welcome message and instructions

## BullMQ Queue Configuration

The email system uses BullMQ for reliable background processing:

- **Queue Name:** `email`
- **Jobs:** `send-otp`, `send-welcome`
- **Retry Policy:** 3 attempts with exponential backoff
- **Backoff Delay:** 2 seconds (doubles each retry)

## Monitoring Queue

You can use Bull Board for queue monitoring:

```bash
npm install @bull-board/express @bull-board/api
```

## Troubleshooting

### Emails Not Sending?

1. **Check Redis:**
   ```bash
   redis-cli ping  # Should return "PONG"
   ```

2. **Check Console Logs:**
   - If EMAIL_USER or EMAIL_PASSWORD is not set, emails will be logged to console only

3. **Gmail Issues:**
   - Verify App Password is correct
   - Check 2FA is enabled
   - Try allowing less secure apps (not recommended)

4. **Queue Not Processing:**
   - Ensure Redis is running
   - Check server logs for queue processor errors

### Development Mode

When credentials are not configured, emails will be logged to the console instead of being sent. This allows development without email setup.

## Production Considerations

1. **Use Environment Variables:** Never commit credentials
2. **Email Service:** Consider using SendGrid, AWS SES, or other email services for production
3. **Redis:** Use managed Redis (Redis Labs, AWS ElastiCache) for production
4. **Rate Limiting:** Implement rate limiting for email sending
5. **Email Templates:** Store templates in database or separate files
6. **Queue Monitoring:** Set up monitoring and alerts for failed jobs

## Alternative Email Providers

### SendGrid
```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASSWORD=your-sendgrid-api-key
```

### AWS SES
```env
EMAIL_HOST=email-smtp.us-east-1.amazonaws.com
EMAIL_PORT=587
EMAIL_USER=your-smtp-username
EMAIL_PASSWORD=your-smtp-password
```

### Mailgun
```env
EMAIL_HOST=smtp.mailgun.org
EMAIL_PORT=587
EMAIL_USER=your-mailgun-user
EMAIL_PASSWORD=your-mailgun-password
```
