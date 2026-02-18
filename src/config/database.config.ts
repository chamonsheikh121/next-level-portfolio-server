import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { User } from '../modules/users/entities/user.entity';

@Injectable()
export class DatabaseConfig implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    // Check if DATABASE_URL is provided (Render, production)
    const databaseUrl = process.env.DATABASE_URL;

    if (databaseUrl) {
      // Parse DATABASE_URL
      return {
        type: 'postgres',
        url: databaseUrl,
        entities: [User],
        synchronize: this.configService.get<boolean>('database.synchronize'),
        logging: this.configService.get<string>('nodeEnv') === 'development',
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      };
    }

    // Fallback to individual config values (local development)
    return {
      type: 'postgres',
      host: this.configService.get<string>('database.host'),
      port: this.configService.get<number>('database.port'),
      username: this.configService.get<string>('database.username'),
      password: this.configService.get<string>('database.password'),
      database: this.configService.get<string>('database.database'),
      entities: [User],
      synchronize: this.configService.get<boolean>('database.synchronize'),
      logging: this.configService.get<string>('nodeEnv') === 'development',
    };
  }
}
