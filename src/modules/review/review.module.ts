import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { CloudinaryModule } from '../../common/cloudinary/cloudinary.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule, CloudinaryModule],
  controllers: [ReviewController],
  providers: [ReviewService, JwtService],
  exports: [ReviewService],
})
export class ReviewModule {}
