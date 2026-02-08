import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { SendOtpEmailJob, SendWelcomeEmailJob } from './email.processor';

@Injectable()
export class EmailQueueService {
  private readonly logger = new Logger(EmailQueueService.name);

  constructor(
    @InjectQueue('email') private emailQueue: Queue,
  ) {}

  /**
   * Queue an OTP email to be sent
   */
  async sendOtpEmail(to: string, otp: string, name: string): Promise<void> {
    try {
      await this.emailQueue.add(
        'send-otp',
        { to, otp, name } as SendOtpEmailJob,
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
      await this.emailQueue.add(
        'send-welcome',
        { to, name } as SendWelcomeEmailJob,
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
      this.logger.log(`Welcome email queued for ${to}`);
    } catch (error) {
      this.logger.error(`Failed to queue welcome email for ${to}:`, error);
      throw error;
    }
  }
}
