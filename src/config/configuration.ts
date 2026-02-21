export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  apiPrefix: process.env.API_PREFIX || 'api',
  nodeEnv: process.env.NODE_ENV || 'development',

  database: {
    type: process.env.DB_TYPE || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'portfolio_db',
    synchronize: process.env.DB_SYNCHRONIZE === 'true',
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: process.env.JWT_EXPIRATION || '1d',
  },

  cors: {
    enabled: process.env.CORS_ENABLED === 'true',
    origin: process.env.CORS_ORIGIN || '*',
  },

  email: {
    // MailerSend (commented out - using Gmail SMTP instead)
    // apiKey: process.env.EMAIL_API_KEY || '',
    
    // Gmail SMTP Configuration
    smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
    smtpPort: parseInt(process.env.SMTP_PORT, 10) || 587,
    smtpSecure: process.env.SMTP_SECURE === 'true', // false for TLS
    smtpUser: process.env.SMTP_USER || '',
    smtpPassword: process.env.SMTP_PASSWORD || '', // App password for Gmail
    
    fromEmail: process.env.EMAIL_FROM || 'noreply@chamonali.me',
    fromName: process.env.EMAIL_FROM_NAME || 'Portfolio',
    adminEmail: process.env.ADMIN_EMAIL || 'admin@chamonali.me',
  },

  redis: {
    url: process.env.REDIS_URL || undefined,
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    password: process.env.REDIS_PASSWORD || '',
  },

  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
  },
});
