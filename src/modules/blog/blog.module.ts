import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule],
  controllers: [BlogController],
  providers: [BlogService, JwtService],
  exports: [BlogService],
})
export class BlogModule {}
