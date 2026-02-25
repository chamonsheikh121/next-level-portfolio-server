import { Module } from '@nestjs/common';
import { ClientProjectCategoryService } from './client-project-category.service';
import { ClientProjectCategoryController } from './client-project-category.controller';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule],
  controllers: [ClientProjectCategoryController],
  providers: [ClientProjectCategoryService, JwtService],
  exports: [ClientProjectCategoryService],
})
export class ClientProjectCategoryModule {}
