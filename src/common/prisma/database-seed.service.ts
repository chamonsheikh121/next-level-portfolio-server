import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class DatabaseSeedService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseSeedService.name);

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    await this.seedDefaultUser();
  }

  private async seedDefaultUser() {
    const email = 'sheikhchamon9@gmail.com';
    const plainPassword = 'Chamonali12!@';
    const name = 'Sheikh Chamonali';

    try {
      // Check if user already exists
      const existingUser = await this.prisma.client.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        this.logger.log(`✅ Default user already exists: ${email}`);
        return;
      }

      // Hash the password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

      // Create the user
      const user = await this.prisma.client.user.create({
        data: {
          email,
          name,
          password: hashedPassword,
          isVerified: true, // Auto-verify the default admin user
        },
      });

      this.logger.log(`✅ Default user created successfully: ${user.email}`);
    } catch (error) {
      this.logger.error('❌ Error seeding default user:', error.message);
    }
  }
}
