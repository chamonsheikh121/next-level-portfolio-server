import { Module } from '@nestjs/common';
import { ServiceService } from './service.service';
import { ServiceController } from './service.controller';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule],
  controllers: [ServiceController],
  providers: [ServiceService, JwtService],
  exports: [ServiceService],
})
export class ServiceModule {}
