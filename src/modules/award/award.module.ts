import { Module } from '@nestjs/common';
import { AwardService } from './award.service';
import { AwardController } from './award.controller';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { CloudinaryModule } from '../../common/cloudinary/cloudinary.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule, CloudinaryModule],
  controllers: [AwardController],
  providers: [AwardService, JwtService],
  exports: [AwardService],
})
export class AwardModule {}
