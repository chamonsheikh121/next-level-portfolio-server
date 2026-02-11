import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { CloudinaryModule } from '../../common/cloudinary/cloudinary.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule, CloudinaryModule],
  controllers: [ProjectController],
  providers: [ProjectService, JwtService],
  exports: [ProjectService],
})
export class ProjectModule {}
