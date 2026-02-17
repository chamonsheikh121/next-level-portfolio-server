import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { EmailService } from './email.service';

export interface SendOtpEmailJob {
  to: string;
  otp: string;
  name: string;
}

export interface SendWelcomeEmailJob {
  to: string;
  name: string;
}

export interface SendUserMessageConfirmationJob {
  to: string;
  name: string;
  title: string;
}

export interface SendAdminNewMessageNotificationJob {
  name: string;
  email: string;
  title: string;
  message: string;
}

export interface SendHireRequestConfirmationJob {
  to: string;
  name: string;
  projectDesc: string;
  budget?: string;
  timeline?: string;
}

export interface SendAdminHireRequestNotificationJob {
  clientName: string;
  clientEmail: string;
  projectDesc: string;
  companyName?: string;
  budget?: string;
  timeline?: string;
  coreFeatures?: string[];
  techSuggestion?: string[];
}

export type EmailJobData =
  | SendOtpEmailJob
  | SendWelcomeEmailJob
  | SendUserMessageConfirmationJob
  | SendAdminNewMessageNotificationJob
  | SendHireRequestConfirmationJob
  | SendAdminHireRequestNotificationJob;

@Processor('email')
export class EmailProcessor extends WorkerHost {
  private readonly logger = new Logger(EmailProcessor.name);

  constructor(private emailService: EmailService) {
    super();
  }

  async process(job: Job<EmailJobData, any, string>): Promise<any> {
    this.logger.log(`Processing email job: ${job.name} (ID: ${job.id})`);

    try {
      switch (job.name) {
        case 'send-otp':
          return await this.handleSendOtp(job.data as SendOtpEmailJob);

        case 'send-welcome':
          return await this.handleSendWelcome(job.data as SendWelcomeEmailJob);

        case 'send-user-message-confirmation':
          return await this.handleSendUserMessageConfirmation(
            job.data as SendUserMessageConfirmationJob,
          );

        case 'send-admin-new-message-notification':
          return await this.handleSendAdminNewMessageNotification(
            job.data as SendAdminNewMessageNotificationJob,
          );

        case 'send-hire-request-confirmation':
          return await this.handleSendHireRequestConfirmation(
            job.data as SendHireRequestConfirmationJob,
          );

        case 'send-admin-hire-request-notification':
          return await this.handleSendAdminHireRequestNotification(
            job.data as SendAdminHireRequestNotificationJob,
          );

        default:
          this.logger.warn(`Unknown job type: ${job.name}`);
          return { success: false, message: 'Unknown job type' };
      }
    } catch (error) {
      this.logger.error(`Failed to process email job ${job.id}:`, error);
      throw error;
    }
  }

  private async handleSendOtp(data: SendOtpEmailJob) {
    this.logger.log(`Sending OTP email to ${data.to}`);
    const success = await this.emailService.sendOtpEmail(data.to, data.otp, data.name);
    return { success, type: 'otp', recipient: data.to };
  }

  private async handleSendWelcome(data: SendWelcomeEmailJob) {
    this.logger.log(`Sending welcome email to ${data.to}`);
    const success = await this.emailService.sendWelcomeEmail(data.to, data.name);
    return { success, type: 'welcome', recipient: data.to };
  }

  private async handleSendUserMessageConfirmation(data: SendUserMessageConfirmationJob) {
    this.logger.log(`Sending user message confirmation email to ${data.to}`);
    const success = await this.emailService.sendUserMessageConfirmation(
      data.to,
      data.name,
      data.title,
    );
    return { success, type: 'user-message-confirmation', recipient: data.to };
  }

  private async handleSendAdminNewMessageNotification(data: SendAdminNewMessageNotificationJob) {
    this.logger.log(`Sending admin notification about message from ${data.email}`);
    const success = await this.emailService.sendAdminNewMessageNotification(
      data.name,
      data.email,
      data.title,
      data.message,
    );
    return {
      success,
      type: 'admin-new-message-notification',
      recipient: 'admin',
    };
  }

  private async handleSendHireRequestConfirmation(data: SendHireRequestConfirmationJob) {
    this.logger.log(`Sending hire request confirmation email to ${data.to}`);
    const success = await this.emailService.sendHireRequestConfirmation(
      data.to,
      data.name,
      data.projectDesc,
      data.budget,
      data.timeline,
    );
    return {
      success,
      type: 'hire-request-confirmation',
      recipient: data.to,
    };
  }

  private async handleSendAdminHireRequestNotification(data: SendAdminHireRequestNotificationJob) {
    this.logger.log(`Sending admin notification about hire request from ${data.clientEmail}`);
    const success = await this.emailService.sendAdminHireRequestNotification(
      data.clientName,
      data.clientEmail,
      data.projectDesc,
      data.companyName,
      data.budget,
      data.timeline,
      data.coreFeatures,
      data.techSuggestion,
    );
    return {
      success,
      type: 'admin-hire-request-notification',
      recipient: 'admin',
    };
  }
}
