import { Module } from '@nestjs/common';
import { EducationService } from './education.service';
import { EducationController } from './education.controller';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { CloudinaryModule } from '../../common/cloudinary/cloudinary.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule, CloudinaryModule],
  controllers: [EducationController],
  providers: [EducationService, JwtService],
  exports: [EducationService],
})
export class EducationModule {}
