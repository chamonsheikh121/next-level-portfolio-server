import { Module } from '@nestjs/common';
import { SkillAndTechService } from './skill-and-tech.service';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { JwtService } from '@nestjs/jwt';
import { SkillAndTechController } from './skill-and-tech.controller';

@Module({
  imports: [PrismaModule],
  controllers: [SkillAndTechController],
  providers: [SkillAndTechService, JwtService],
  exports: [SkillAndTechService],
})
export class SkillAndTechModule {}
