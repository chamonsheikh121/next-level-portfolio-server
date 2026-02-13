import { Module } from '@nestjs/common';
import { SkillAndTechService } from './skill-and-tech.service';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { CloudinaryModule } from '../../common/cloudinary/cloudinary.module';
import { JwtService } from '@nestjs/jwt';
import { SkillAndTechController } from './skill-and-tech.controller';

@Module({
  imports: [PrismaModule, CloudinaryModule],
  controllers: [SkillAndTechController],
  providers: [SkillAndTechService, JwtService],
  exports: [SkillAndTechService],
})
export class SkillAndTechModule {}
