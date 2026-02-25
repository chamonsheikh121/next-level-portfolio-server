import { Module } from '@nestjs/common';
import { ClientProjectService } from './client-project.service';
import { ClientProjectController } from './client-project.controller';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule],
  controllers: [ClientProjectController],
  providers: [ClientProjectService, JwtService],
  exports: [ClientProjectService],
})
export class ClientProjectModule {}
