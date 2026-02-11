import { Module } from '@nestjs/common';
import { SocialService } from './social.service';
import { SocialController } from './social.controller';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { CloudinaryModule } from '../../common/cloudinary/cloudinary.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule, CloudinaryModule],
  controllers: [SocialController],
  providers: [SocialService, JwtService],
  exports: [SocialService],
})
export class SocialModule {}
