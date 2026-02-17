import { Module } from '@nestjs/common';
import { UserMessageService } from './user-message.service';
import { UserMessageController } from './user-message.controller';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { EmailModule } from '../../common/email/email.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule, EmailModule],
  controllers: [UserMessageController],
  providers: [UserMessageService, JwtService],
  exports: [UserMessageService],
})
export class UserMessageModule {}
