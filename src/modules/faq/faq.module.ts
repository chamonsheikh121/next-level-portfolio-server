import { Module } from '@nestjs/common';
import { FaqService } from './faq.service';
import { FaqController } from './faq.controller';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule],
  controllers: [FaqController],
  providers: [FaqService, JwtService],
  exports: [FaqService],
})
export class FaqModule {}
