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

export type EmailJobData = SendOtpEmailJob | SendWelcomeEmailJob;

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
    const success = await this.emailService.sendOtpEmail(
      data.to,
      data.otp,
      data.name,
    );
    return { success, type: 'otp', recipient: data.to };
  }

  private async handleSendWelcome(data: SendWelcomeEmailJob) {
    this.logger.log(`Sending welcome email to ${data.to}`);
    const success = await this.emailService.sendWelcomeEmail(data.to, data.name);
    return { success, type: 'welcome', recipient: data.to };
  }
}
