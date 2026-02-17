import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProfileModule } from './modules/profile/profile.module';
import { SkillAndTechModule } from './modules/skill_and_tech/skill-and-tech.module';
import { ExperienceModule } from './modules/experience/experience.module';
import { EducationModule } from './modules/education/education.module';
import { AwardModule } from './modules/award/award.module';
import { SocialModule } from './modules/social/social.module';
import { ProjectModule } from './modules/project/project.module';
import { BlogModule } from './modules/blog/blog.module';
import { ServiceModule } from './modules/service/service.module';
import { ReviewModule } from './modules/review/review.module';
import { NpmModule } from './modules/npm/npm.module';
import { FaqModule } from './modules/faq/faq.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { UserMessageModule } from './modules/user-message/user-message.module';
import { HireModule } from './modules/hire/hire.module';
import { DatabaseConfig } from './config/database.config';
import configuration from './config/configuration';
import { PrismaModule } from './common/prisma/prisma.module';
import { EmailModule } from './common/email/email.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfig,
    }),
    PrismaModule,
    EmailModule,
    AuthModule,
    UsersModule,
    ProfileModule,
    SkillAndTechModule,
    ExperienceModule,
    EducationModule,
    AwardModule,
    SocialModule,
    ProjectModule,
    BlogModule,
    ServiceModule,
    ReviewModule,
    NpmModule,
    FaqModule,
    AnalyticsModule,
    UserMessageModule,
    HireModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
