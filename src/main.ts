import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable cookie parser
  app.use(cookieParser());

  // Global prefix
  const apiPrefix = process.env.API_PREFIX || 'api';
  app.setGlobalPrefix(apiPrefix);

  // CORS
  const corsEnabled = process.env.CORS_ENABLED === 'true';
  if (corsEnabled) {
    app.enableCors({
      origin: process.env.CORS_ORIGIN || '*',
      credentials: true,
    });
  }

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global exception filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Global interceptors
  app.useGlobalInterceptors(new TransformInterceptor());

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Portfolio API')
    .setDescription('Professional Portfolio Server API Documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Authentication endpoints')
    .addTag('users', 'User management endpoints')
    .addTag('profile', 'Profile management endpoints')
    .addTag('skills', 'Skills and technologies endpoints')
    .addTag('experience', 'Experience management endpoints')
    .addTag('education', 'Education management endpoints')
    .addTag('awards', 'Awards and achievements endpoints')
    .addTag('social', 'Social media links endpoints')
    .addTag('projects', 'Project portfolio endpoints')
    .addTag('blogs', 'Blog and articles endpoints')
    .addTag('services', 'Services offered endpoints')
    .addTag('reviews', 'Client reviews and testimonials endpoints')
    .addTag('npm', 'NPM packages endpoints')
    .addTag('faqs', 'Frequently asked questions endpoints')
    .addTag('analytics', 'Website analytics and visitor tracking endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Swagger UI v5 with built-in dark mode support
  SwaggerModule.setup(`${apiPrefix}/docs`, app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
      tryItOutEnabled: true,
    },
    customSiteTitle: 'Portfolio API Documentation',
    customCss: '.swagger-ui .topbar { display: none }',
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 Application is running on: http://localhost:${port}/${apiPrefix}`);
  console.log(`📚 Swagger documentation: http://localhost:${port}/${apiPrefix}/docs`);
}

bootstrap();
