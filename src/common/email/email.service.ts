import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: Transporter;

  constructor(private configService: ConfigService) {
    this.createTransporter();
  }

  private createTransporter() {
    const user = this.configService.get<string>('email.user');
    const pass = this.configService.get<string>('email.password');

    // Skip creating transporter if credentials are not set
    if (!user || !pass) {
      this.logger.warn('Email credentials not configured. Emails will be logged to console only.');
      return;
    }

    const emailConfig: SMTPTransport.Options = {
      host: this.configService.get<string>('email.host'),
      port: this.configService.get<number>('email.port'),
      secure: this.configService.get<boolean>('email.secure'),
      auth: {
        user,
        pass,
      },
      dnsTimeout: 30000,
      // Timeout settings for production (in milliseconds)
      connectionTimeout: 60000, // 60 seconds
      greetingTimeout: 30000, // 30 seconds
      socketTimeout: 60000, // 60 seconds
      // TLS settings for Gmail
      tls: {
        rejectUnauthorized: false,
      },
    };

    this.logger.log(
      `Creating email transporter with host: ${emailConfig.host}:${emailConfig.port}`,
    );
    this.transporter = nodemailer.createTransport(emailConfig);

    // Verify transporter configuration (async to not block startup)
    this.transporter
      .verify()
      .then(() => {
        this.logger.log('✅ Email transporter is ready to send emails');
      })
      .catch((error) => {
        this.logger.error('❌ Email transporter verification failed:', {
          message: error.message,
          code: error.code,
          command: error.command,
        });
        this.logger.warn(
          'Email service will still attempt to send emails despite verification failure',
        );
      });
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    const from = this.configService.get<string>('email.from');

    // If transporter is not configured, just log the email
    if (!this.transporter) {
      this.logger.log(
        `📧 Email to be sent (no transporter configured):\nTo: ${options.to}\nSubject: ${options.subject}\n${options.text || options.html}`,
      );
      return true;
    }

    try {
      this.logger.log(`Attempting to send email to ${options.to} with subject: ${options.subject}`);

      const info = await this.transporter.sendMail({
        from,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      });

      this.logger.log(`✅ Email sent successfully to ${options.to}: ${info.messageId}`);
      return true;
    } catch (error) {
      this.logger.error(`❌ Failed to send email to ${options.to}:`, {
        message: error.message,
        code: error.code,
        command: error.command,
        response: error.response,
        responseCode: error.responseCode,
      });
      return false;
    }
  }

  /**
   * Send OTP email
   */
  async sendOtpEmail(to: string, otp: string, name: string): Promise<boolean> {
    const subject = 'Your Login OTP Code';
    const html = this.getOtpEmailTemplate(otp, name);
    const text = `Hello ${name},\n\nYour OTP code is: ${otp}\n\nThis code will expire in 10 minutes.\n\nIf you didn't request this code, please ignore this email.`;

    return this.sendEmail({ to, subject, html, text });
  }

  /**
   * OTP Email HTML template
   */
  private getOtpEmailTemplate(otp: string, name: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Your OTP Code</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .otp-box { background: white; border: 2px dashed #667eea; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
            .otp-code { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 8px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 12px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Login Verification</h1>
            </div>
            <div class="content">
              <h2>Hello ${name},</h2>
              <p>You requested to login to your account. Please use the following One-Time Password (OTP) to complete your login:</p>
              
              <div class="otp-box">
                <p style="margin: 0; font-size: 14px; color: #666;">Your OTP Code</p>
                <div class="otp-code">${otp}</div>
                <p style="margin: 10px 0 0 0; font-size: 12px; color: #999;">Valid for 10 minutes</p>
              </div>

              <div class="warning">
                <strong>⚠️ Security Notice:</strong> Never share this OTP with anyone. Our team will never ask for your OTP.
              </div>

              <p>If you didn't request this code, please ignore this email or contact support if you have concerns.</p>
              
              <p>Best regards,<br>Your Portfolio Team</p>
            </div>
            <div class="footer">
              <p>This is an automated email. Please do not reply to this message.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  /**
   * Send welcome email for new users
   */
  async sendWelcomeEmail(to: string, name: string): Promise<boolean> {
    const subject = 'Welcome to Portfolio Platform';
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Welcome</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Welcome!</h1>
            </div>
            <div class="content">
              <h2>Hello ${name},</h2>
              <p>Welcome to our platform! Your account has been successfully created.</p>
              <p>You can now login using your credentials and an OTP that will be sent to your email.</p>
              <p>Best regards,<br>Your Portfolio Team</p>
            </div>
          </div>
        </body>
      </html>
    `;
    const text = `Hello ${name},\n\nWelcome to our platform! Your account has been successfully created.\n\nYou can now login using your credentials and an OTP that will be sent to your email.`;

    return this.sendEmail({ to, subject, html, text });
  }

  /**
   * Send user message confirmation email
   */
  async sendUserMessageConfirmation(to: string, name: string, title: string): Promise<boolean> {
    const subject = 'We Received Your Message!';
    const html = this.getUserMessageConfirmationTemplate(name, title);
    const text = `Hello ${name},\n\nThank you for reaching out to us!\n\nWe have received your message regarding "${title}" and our team is reviewing it.\n\nWe will get back to you as soon as possible, typically within 24-48 hours.\n\nBest regards,\nYour Portfolio Team`;

    return this.sendEmail({ to, subject, html, text });
  }

  /**
   * User message confirmation email template
   */
  private getUserMessageConfirmationTemplate(name: string, title: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Message Received</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .message-box { background: white; border-left: 4px solid #667eea; padding: 15px; margin: 20px 0; border-radius: 4px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            .checkmark { font-size: 48px; text-align: center; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✉️ Message Received</h1>
            </div>
            <div class="content">
              <div class="checkmark">✅</div>
              <h2>Hello ${name},</h2>
              <p>Thank you for reaching out to us! We have successfully received your message.</p>
              
              <div class="message-box">
                <p style="margin: 0; font-size: 14px; color: #666;"><strong>Subject:</strong></p>
                <p style="margin: 5px 0; font-size: 16px;">${title}</p>
              </div>

              <p>Our team is currently reviewing your message and will get back to you as soon as possible. We typically respond within <strong>24-48 hours</strong>.</p>

              <p>In the meantime, if you have any urgent concerns, please don't hesitate to reach out to us directly.</p>
              
              <p>Best regards,<br>Your Portfolio Team</p>
            </div>
            <div class="footer">
              <p>This is an automated confirmation. Please do not reply to this message.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  /**
   * Send admin notification about new user message
   */
  async sendAdminNewMessageNotification(
    name: string,
    email: string,
    title: string,
    message: string,
  ): Promise<boolean> {
    const adminEmail = this.configService.get<string>('email.adminEmail');
    const subject = `🔔 New Message from ${name}`;
    const html = this.getAdminNewMessageTemplate(name, email, title, message);
    const text = `New Message Received\n\nFrom: ${name} (${email})\nSubject: ${title}\n\nMessage:\n${message}`;

    return this.sendEmail({ to: adminEmail, subject, html, text });
  }

  /**
   * Admin new message notification template
   */
  private getAdminNewMessageTemplate(
    name: string,
    email: string,
    title: string,
    message: string,
  ): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Message</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .info-row { display: flex; margin: 10px 0; }
            .info-label { font-weight: bold; min-width: 100px; color: #666; }
            .message-box { background: white; border: 1px solid #ddd; padding: 20px; margin: 20px 0; border-radius: 8px; }
            .badge { background: #FF6B6B; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; display: inline-block; margin-left: 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔔 New Message Received</h1>
            </div>
            <div class="content">
              <h2>Message Details <span class="badge">NEW</span></h2>
              
              <div class="info-row">
                <span class="info-label">From:</span>
                <span>${name}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Email:</span>
                <span><a href="mailto:${email}">${email}</a></span>
              </div>
              <div class="info-row">
                <span class="info-label">Subject:</span>
                <span>${title}</span>
              </div>
              
              <div class="message-box">
                <h3 style="margin-top: 0;">Message Content:</h3>
                <p>${message.replace(/\n/g, '<br>')}</p>
              </div>

              <p style="color: #666; font-size: 14px;">
                <strong>Next steps:</strong> Please review this message and respond to the user within 24-48 hours.
              </p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  /**
   * Send hire request confirmation email to client
   */
  async sendHireRequestConfirmation(
    to: string,
    name: string,
    projectDesc: string,
    budget?: string,
    timeline?: string,
  ): Promise<boolean> {
    const subject = 'Thank You for Your Hire Request!';
    const html = this.getHireRequestConfirmationTemplate(name, projectDesc, budget, timeline);
    const text = `Hello ${name},\n\nThank you for submitting your hire request!\n\nProject: ${projectDesc}\n${budget ? `Budget: ${budget}\n` : ''}${timeline ? `Timeline: ${timeline}\n` : ''}\n\nI have received your request and will review it carefully. I'll get back to you within 24-48 hours to discuss your project in detail.\n\nBest regards,\nYour Portfolio Team`;

    return this.sendEmail({ to, subject, html, text });
  }

  /**
   * Hire request confirmation email template
   */
  private getHireRequestConfirmationTemplate(
    name: string,
    projectDesc: string,
    budget?: string,
    timeline?: string,
  ): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Hire Request Received</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
            .container { max-width: 650px; margin: 20px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%); color: white; padding: 40px 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; font-weight: 600; }
            .header p { margin: 10px 0 0 0; font-size: 16px; opacity: 0.95; }
            .content { padding: 40px 30px; }
            .greeting { font-size: 18px; color: #1f2937; margin-bottom: 20px; }
            .success-badge { background: #10b981; color: white; padding: 8px 16px; border-radius: 20px; font-size: 14px; display: inline-block; margin: 20px 0; }
            .project-box { background: #f8fafc; border-left: 4px solid #4F46E5; padding: 20px; margin: 25px 0; border-radius: 8px; }
            .project-box h3 { margin: 0 0 15px 0; color: #4F46E5; font-size: 16px; text-transform: uppercase; letter-spacing: 0.5px; }
            .project-desc { color: #4b5563; font-size: 15px; line-height: 1.7; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 25px 0; }
            .info-card { background: white; border: 2px solid #e5e7eb; padding: 15px; border-radius: 8px; text-align: center; }
            .info-label { color: #6b7280; font-size: 12px; text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px; margin-bottom: 5px; }
            .info-value { color: #1f2937; font-size: 16px; font-weight: 600; }
            .next-steps { background: #eff6ff; border: 1px solid #93c5fd; padding: 20px; border-radius: 8px; margin: 25px 0; }
            .next-steps h3 { margin: 0 0 12px 0; color: #1e40af; font-size: 16px; }
            .next-steps ul { margin: 0; padding-left: 20px; }
            .next-steps li { color: #1e40af; margin: 8px 0; }
            .cta-box { text-align: center; margin: 30px 0; }
            .note { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px; }
            .note-text { margin: 0; color: #92400e; font-size: 14px; }
            .footer { background: #f9fafb; padding: 25px 30px; border-top: 1px solid #e5e7eb; text-align: center; }
            .footer-text { color: #6b7280; font-size: 13px; margin: 5px 0; }
            .signature { margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb; }
            .signature-name { font-weight: 600; color: #1f2937; font-size: 16px; }
            .signature-title { color: #6b7280; font-size: 14px; margin-top: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎯 Request Received!</h1>
              <p>Your hire request has been successfully submitted</p>
            </div>
            <div class="content">
              <div class="greeting">Hello <strong>${name}</strong>,</div>
              
              <p style="font-size: 15px; color: #4b5563;">Thank you for reaching out and showing interest in working together! I'm excited to learn more about your project.</p>
              
              <div class="success-badge">✓ Request Submitted Successfully</div>

              <div class="project-box">
                <h3>📋 Project Overview</h3>
                <div class="project-desc">${projectDesc || 'No description provided'}</div>
              </div>

              ${
                budget || timeline
                  ? `
              <div class="info-grid">
                ${
                  budget
                    ? `
                <div class="info-card">
                  <div class="info-label">Budget</div>
                  <div class="info-value">💰 ${budget}</div>
                </div>
                `
                    : ''
                }
                ${
                  timeline
                    ? `
                <div class="info-card">
                  <div class="info-label">Timeline</div>
                  <div class="info-value">⏱️ ${timeline}</div>
                </div>
                `
                    : ''
                }
              </div>
              `
                  : ''
              }

              <div class="next-steps">
                <h3>📌 What Happens Next?</h3>
                <ul>
                  <li>I will carefully review your project requirements</li>
                  <li>You'll receive a detailed response within <strong>24-48 hours</strong></li>
                  <li>We can schedule a call to discuss your project in depth</li>
                  <li>I'll provide a customized proposal tailored to your needs</li>
                </ul>
              </div>

              <div class="note">
                <p class="note-text">
                  <strong>📧 Keep an eye on your inbox!</strong> I'll reach out soon with more information. If you have any urgent questions in the meantime, feel free to reply to this email.
                </p>
              </div>

              <div class="signature">
                <div class="signature-name">Best regards,</div>
                <div class="signature-title">Your Development Partner</div>
              </div>
            </div>
            <div class="footer">
              <p class="footer-text">This is an automated confirmation email.</p>
              <p class="footer-text">© ${new Date().getFullYear()} Portfolio Platform. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  /**
   * Send admin notification about new hire request
   */
  async sendAdminHireRequestNotification(
    clientName: string,
    clientEmail: string,
    projectDesc: string,
    companyName?: string,
    budget?: string,
    timeline?: string,
    coreFeatures?: string[],
    techSuggestion?: string[],
  ): Promise<boolean> {
    const adminEmail = this.configService.get<string>('email.adminEmail');
    const subject = `🚀 New Hire Request from ${clientName}`;
    const html = this.getAdminHireRequestTemplate(
      clientName,
      clientEmail,
      projectDesc,
      companyName,
      budget,
      timeline,
      coreFeatures,
      techSuggestion,
    );
    const text = `New Hire Request Received!\n\nClient: ${clientName}${companyName ? ` (${companyName})` : ''}\nEmail: ${clientEmail}\n\nProject: ${projectDesc}\n${budget ? `Budget: ${budget}\n` : ''}${timeline ? `Timeline: ${timeline}\n` : ''}${coreFeatures?.length ? `\nCore Features:\n${coreFeatures.map((f) => `- ${f}`).join('\n')}` : ''}${techSuggestion?.length ? `\nTech Stack:\n${techSuggestion.map((t) => `- ${t}`).join('\n')}` : ''}`;

    return this.sendEmail({ to: adminEmail, subject, html, text });
  }

  /**
   * Admin hire request notification template
   */
  private getAdminHireRequestTemplate(
    clientName: string,
    clientEmail: string,
    projectDesc: string,
    companyName?: string,
    budget?: string,
    timeline?: string,
    coreFeatures?: string[],
    techSuggestion?: string[],
  ): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Hire Request</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
            .container { max-width: 700px; margin: 20px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #DC2626 0%, #F97316 100%); color: white; padding: 35px 30px; }
            .header h1 { margin: 0; font-size: 26px; font-weight: 600; }
            .badge { background: rgba(255,255,255,0.2); color: white; padding: 6px 14px; border-radius: 20px; font-size: 13px; display: inline-block; margin-top: 10px; font-weight: 600; }
            .content { padding: 35px 30px; }
            .alert-box { background: #fee2e2; border-left: 4px solid #DC2626; padding: 15px 20px; margin-bottom: 25px; border-radius: 6px; }
            .alert-text { margin: 0; color: #991b1b; font-weight: 600; font-size: 15px; }
            .client-info { background: #f8fafc; padding: 25px; border-radius: 10px; margin: 20px 0; border: 2px solid #e2e8f0; }
            .info-row { display: flex; padding: 12px 0; border-bottom: 1px solid #e2e8f0; }
            .info-row:last-child { border-bottom: none; }
            .info-label { font-weight: 600; min-width: 140px; color: #64748b; font-size: 14px; }
            .info-value { color: #1e293b; flex: 1; font-size: 14px; }
            .info-value a { color: #2563eb; text-decoration: none; }
            .info-value a:hover { text-decoration: underline; }
            .section { margin: 25px 0; }
            .section-title { color: #DC2626; font-size: 16px; font-weight: 600; margin-bottom: 12px; display: flex; align-items: center; }
            .project-desc { background: white; border: 2px solid #e2e8f0; padding: 20px; border-radius: 8px; color: #334155; line-height: 1.7; font-size: 15px; }
            .features-list { background: #f0fdf4; border-left: 4px solid #22c55e; padding: 20px; border-radius: 6px; margin: 15px 0; }
            .features-list h4 { margin: 0 0 12px 0; color: #166534; font-size: 15px; }
            .features-list ul { margin: 0; padding-left: 20px; }
            .features-list li { color: #166534; margin: 6px 0; }
            .tech-list { background: #eff6ff; border-left: 4px solid #3b82f6; padding: 20px; border-radius: 6px; margin: 15px 0; }
            .tech-list h4 { margin: 0 0 12px 0; color: #1e40af; font-size: 15px; }
            .tech-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
            .tech-tag { background: #3b82f6; color: white; padding: 6px 14px; border-radius: 16px; font-size: 13px; font-weight: 500; }
            .cta-box { background: #fef3c7; border: 2px solid #f59e0b; padding: 20px; border-radius: 8px; margin: 25px 0; text-align: center; }
            .cta-text { margin: 0 0 15px 0; color: #92400e; font-size: 15px; font-weight: 600; }
            .cta-button { background: #DC2626; color: white; padding: 12px 30px; border-radius: 6px; text-decoration: none; display: inline-block; font-weight: 600; }
            .footer { background: #f9fafb; padding: 20px 30px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 12px; }
            .timestamp { color: #9ca3af; font-size: 13px; margin-top: 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚀 New Hire Request</h1>
              <div class="badge">⚡ REQUIRES ATTENTION</div>
            </div>
            <div class="content">
              <div class="alert-box">
                <p class="alert-text">⏰ Action Required: Review and respond within 24-48 hours</p>
              </div>

              <div class="client-info">
                <div class="info-row">
                  <span class="info-label">👤 Client Name:</span>
                  <span class="info-value"><strong>${clientName}</strong></span>
                </div>
                ${
                  companyName
                    ? `
                <div class="info-row">
                  <span class="info-label">🏢 Company:</span>
                  <span class="info-value">${companyName}</span>
                </div>
                `
                    : ''
                }
                <div class="info-row">
                  <span class="info-label">📧 Email:</span>
                  <span class="info-value"><a href="mailto:${clientEmail}">${clientEmail}</a></span>
                </div>
                ${
                  budget
                    ? `
                <div class="info-row">
                  <span class="info-label">💰 Budget:</span>
                  <span class="info-value"><strong style="color: #DC2626;">${budget}</strong></span>
                </div>
                `
                    : ''
                }
                ${
                  timeline
                    ? `
                <div class="info-row">
                  <span class="info-label">⏱️ Timeline:</span>
                  <span class="info-value"><strong>${timeline}</strong></span>
                </div>
                `
                    : ''
                }
              </div>

              <div class="section">
                <div class="section-title">📋 Project Description</div>
                <div class="project-desc">${projectDesc || 'No description provided'}</div>
              </div>

              ${
                coreFeatures?.length
                  ? `
              <div class="features-list">
                <h4>✨ Core Features Requested</h4>
                <ul>
                  ${coreFeatures.map((feature) => `<li>${feature}</li>`).join('')}
                </ul>
              </div>
              `
                  : ''
              }

              ${
                techSuggestion?.length
                  ? `
              <div class="tech-list">
                <h4>🛠️ Suggested Tech Stack</h4>
                <div class="tech-tags">
                  ${techSuggestion.map((tech) => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
              </div>
              `
                  : ''
              }

              <div class="cta-box">
                <p class="cta-text">📬 Don't forget to respond to the client!</p>
                <a href="mailto:${clientEmail}" class="cta-button">Reply to ${clientName}</a>
              </div>

              <div class="timestamp">
                📅 Received: ${new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}
              </div>
            </div>
            <div class="footer">
              <p>This is an automated notification from your Portfolio Platform.</p>
              <p>© ${new Date().getFullYear()} Portfolio Admin Panel</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }
}
