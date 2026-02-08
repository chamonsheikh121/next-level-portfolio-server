import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { DatabaseSeedService } from './database-seed.service';

@Global()
@Module({
  providers: [PrismaService, DatabaseSeedService],
  exports: [PrismaService],
})
export class PrismaModule {}