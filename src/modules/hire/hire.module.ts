import { Module } from '@nestjs/common';
import { HireService } from './hire.service';
import { HireController } from './hire.controller';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { CloudinaryModule } from '../../common/cloudinary/cloudinary.module';
import { EmailModule } from '../../common/email/email.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule, CloudinaryModule, EmailModule],
  controllers: [HireController],
  providers: [HireService, JwtService],
  exports: [HireService],
})
export class HireModule {}
