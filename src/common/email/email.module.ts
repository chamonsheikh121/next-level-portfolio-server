import { Module, Logger } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';
import { EmailService } from './email.service';
import { EmailProcessor } from './email.processor';
import { EmailQueueService } from './email-queue.service';

@Module({
  imports: [
    BullModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const logger = new Logger('BullMQ-Config');

        // 🔥 IMPORTANT: Use direct ENV key (production safe)
        const redisUrl = configService.get<string>('REDIS_URL');

        logger.log(`REDIS_URL from ENV: ${redisUrl ? 'FOUND ✅' : 'NOT FOUND ❌'}`);

        if (redisUrl) {
          try {
            const url = new URL(redisUrl);

            logger.log(`Connecting to Redis at host: ${url.hostname}`);
            logger.log(`Port: ${url.port}`);
            logger.log(`Username: ${url.username || 'none'}`);

            return {
              connection: {
                host: url.hostname,
                port: parseInt(url.port) || 6379,
                username: url.username || undefined,
                password: url.password || undefined,
              },
            };
          } catch (error) {
            logger.error('Failed to parse REDIS_URL', error);
            throw error;
          }
        }

        // Fallback (local dev)
        logger.warn('Using local Redis fallback configuration');

        return {
          connection: {
            host: configService.get<string>('redis.host'),
            port: configService.get<number>('redis.port'),
            password: configService.get<string>('redis.password') || undefined,
          },
        };
      },
      inject: [ConfigService],
    }),

    BullModule.registerQueue({
      name: 'email',
    }),
  ],
  providers: [EmailService, EmailProcessor, EmailQueueService],
  exports: [EmailService, EmailQueueService],
})
export class EmailModule {}
