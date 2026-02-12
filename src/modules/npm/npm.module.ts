import { Module } from '@nestjs/common';
import { NpmService } from './npm.service';
import { NpmController } from './npm.controller';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule],
  controllers: [NpmController],
  providers: [NpmService, JwtService],
  exports: [NpmService],
})
export class NpmModule {}
