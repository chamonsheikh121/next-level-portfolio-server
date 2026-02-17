import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import {
  SendOtpEmailJob,
  SendWelcomeEmailJob,
  SendUserMessageConfirmationJob,
  SendAdminNewMessageNotificationJob,
  SendHireRequestConfirmationJob,
  SendAdminHireRequestNotificationJob,
} from './email.processor';

@Injectable()
export class EmailQueueService {
  private readonly logger = new Logger(EmailQueueService.name);

  constructor(@InjectQueue('email') private emailQueue: Queue) {}

  /**
   * Queue an OTP email to be sent
   */
  async sendOtpEmail(to: string, otp: string, name: string): Promise<void> {
    try {
      await this.emailQueue.add('send-otp', { to, otp, name } as SendOtpEmailJob, {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
        removeOnComplete: true,
        removeOnFail: false,
      });
      this.logger.log(`OTP email queued for ${to}`);
    } catch (error) {
      this.logger.error(`Failed to queue OTP email for ${to}:`, error);
      throw error;
    }
  }

  /**
   * Queue a welcome email to be sent
   */
  async sendWelcomeEmail(to: string, name: string): Promise<void> {
    try {
      await this.emailQueue.add('send-welcome', { to, name } as SendWelcomeEmailJob, {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
        removeOnComplete: true,
        removeOnFail: false,
      });
      this.logger.log(`Welcome email queued for ${to}`);
    } catch (error) {
      this.logger.error(`Failed to queue welcome email for ${to}:`, error);
      throw error;
    }
  }

  /**
   * Queue a user message confirmation email to be sent
   */
  async sendUserMessageConfirmation(to: string, name: string, title: string): Promise<void> {
    try {
      await this.emailQueue.add(
        'send-user-message-confirmation',
        { to, name, title } as SendUserMessageConfirmationJob,
        {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 2000,
          },
          removeOnComplete: true,
          removeOnFail: false,
        },
      );
      this.logger.log(`User message confirmation email queued for ${to}`);
    } catch (error) {
      this.logger.error(`Failed to queue user message confirmation email for ${to}:`, error);
      throw error;
    }
  }

  /**
   * Queue an admin notification email about new user message
   */
  async sendAdminNewMessageNotification(
    name: string,
    email: string,
    title: string,
    message: string,
  ): Promise<void> {
    try {
      await this.emailQueue.add(
        'send-admin-new-message-notification',
        { name, email, title, message } as SendAdminNewMessageNotificationJob,
        {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 2000,
          },
          removeOnComplete: true,
          removeOnFail: false,
        },
      );
      this.logger.log(`Admin notification email queued for new message from ${email}`);
    } catch (error) {
      this.logger.error(`Failed to queue admin notification email:`, error);
      throw error;
    }
  }

  /**
   * Queue a hire request confirmation email to client
   */
  async sendHireRequestConfirmation(
    to: string,
    name: string,
    projectDesc: string,
    budget?: string,
    timeline?: string,
  ): Promise<void> {
    try {
      await this.emailQueue.add(
        'send-hire-request-confirmation',
        { to, name, projectDesc, budget, timeline } as SendHireRequestConfirmationJob,
        {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 2000,
          },
          removeOnComplete: true,
          removeOnFail: false,
        },
      );
      this.logger.log(`Hire request confirmation email queued for ${to}`);
    } catch (error) {
      this.logger.error(`Failed to queue hire request confirmation email for ${to}:`, error);
      throw error;
    }
  }

  /**
   * Queue an admin notification email about new hire request
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
  ): Promise<void> {
    try {
      await this.emailQueue.add(
        'send-admin-hire-request-notification',
        {
          clientName,
          clientEmail,
          projectDesc,
          companyName,
          budget,
          timeline,
          coreFeatures,
          techSuggestion,
        } as SendAdminHireRequestNotificationJob,
        {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 2000,
          },
          removeOnComplete: true,
          removeOnFail: false,
        },
      );
      this.logger.log(`Admin hire request notification email queued from ${clientEmail}`);
    } catch (error) {
      this.logger.error(`Failed to queue admin hire request notification email:`, error);
      throw error;
    }
  }
}
