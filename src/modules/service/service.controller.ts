import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('services')
@Controller('services')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create a new service with optional image upload' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
          description: 'Service image (optional)',
        },
        title: { type: 'string', example: 'Full-Stack Web Development' },
        subtitle: { type: 'string', example: 'Building modern, scalable web applications' },
        bulletPoints: {
          type: 'array',
          items: { type: 'string' },
          example: ['Custom web application development', 'RESTful API design'],
        },
        coreTechStacks: {
          type: 'array',
          items: { type: 'string' },
          example: ['React', 'Node.js', 'PostgreSQL'],
        },
      },
      required: ['title'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Service created successfully',
    schema: {
      example: {
        id: 1,
        title: 'Full-Stack Web Development',
        subtitle: 'Building modern, scalable web applications',
        imageURL: 'https://res.cloudinary.com/demo/image/upload/v1234567890/portfolio/services/service.png',
        bulletPoints: [
          'Custom web application development',
          'RESTful API design and implementation',
          'Database design and optimization',
          'Cloud deployment and DevOps',
        ],
        coreTechStacks: ['React', 'Next.js', 'Node.js', 'NestJS', 'PostgreSQL', 'AWS'],
        createdAt: '2024-02-11T10:00:00.000Z',
        updatedAt: '2024-02-11T10:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    schema: {
      example: {
        statusCode: 400,
        message: 'Validation failed',
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
      },
    },
  })
  create(@Body() createServiceDto: CreateServiceDto, @UploadedFile() file?: Express.Multer.File) {
    return this.serviceService.create(createServiceDto, file);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all services' })
  @ApiResponse({
    status: 200,
    description: 'Services retrieved successfully',
    schema: {
      example: [
        {
          id: 1,
          title: 'Full-Stack Web Development',
          subtitle: 'Building modern, scalable web applications',
          imageURL: 'https://res.cloudinary.com/demo/image/upload/v1234567890/portfolio/services/service1.png',
          bulletPoints: [
            'Custom web application development',
            'RESTful API design and implementation',
            'Database design and optimization',
          ],
          coreTechStacks: ['React', 'Next.js', 'Node.js', 'NestJS'],
          createdAt: '2024-02-11T10:00:00.000Z',
          updatedAt: '2024-02-11T10:00:00.000Z',
        },
        {
          id: 2,
          title: 'Mobile App Development',
          subtitle: 'Native and cross-platform mobile solutions',
          imageURL: 'https://res.cloudinary.com/demo/image/upload/v1234567890/portfolio/services/service2.png',
          bulletPoints: [
            'iOS and Android app development',
            'React Native applications',
            'App store deployment',
          ],
          coreTechStacks: ['React Native', 'Flutter', 'Swift', 'Kotlin'],
          createdAt: '2024-02-10T10:00:00.000Z',
          updatedAt: '2024-02-10T10:00:00.000Z',
        },
      ],
    },
  })
  findAll() {
    return this.serviceService.findAll();
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get service by ID' })
  @ApiParam({ name: 'id', description: 'Service ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Service retrieved successfully',
    schema: {
      example: {
        id: 1,
        title: 'Full-Stack Web Development',
        subtitle: 'Building modern, scalable web applications',
        imageURL: 'https://res.cloudinary.com/demo/image/upload/v1234567890/portfolio/services/service.png',
        bulletPoints: [
          'Custom web application development',
          'RESTful API design and implementation',
          'Database design and optimization',
          'Cloud deployment and DevOps',
        ],
        coreTechStacks: ['React', 'Next.js', 'Node.js', 'NestJS', 'PostgreSQL', 'AWS'],
        createdAt: '2024-02-11T10:00:00.000Z',
        updatedAt: '2024-02-11T10:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Service not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Service with ID 999 not found',
        error: 'Not Found',
      },
    },
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.serviceService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Update service with optional image upload' })
  @ApiParam({ name: 'id', description: 'Service ID', type: Number })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
          description: 'Service image (optional)',
        },
        title: { type: 'string' },
        subtitle: { type: 'string' },
        bulletPoints: {
          type: 'array',
          items: { type: 'string' },
        },
        coreTechStacks: {
          type: 'array',
          items: { type: 'string' },
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Service updated successfully',
    schema: {
      example: {
        id: 1,
        title: 'Full-Stack Web Development (Updated)',
        subtitle: 'Building modern, scalable web applications with cutting-edge tech',
        imageURL: 'https://res.cloudinary.com/demo/image/upload/v1234567890/portfolio/services/service-updated.png',
        bulletPoints: [
          'Custom web application development',
          'RESTful API design and implementation',
          'Database design and optimization',
          'Cloud deployment and DevOps',
          'Performance optimization',
        ],
        coreTechStacks: ['React', 'Next.js', 'Node.js', 'NestJS', 'PostgreSQL', 'AWS', 'Docker'],
        createdAt: '2024-02-11T10:00:00.000Z',
        updatedAt: '2024-02-11T11:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Service not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Service with ID 999 not found',
        error: 'Not Found',
      },
    },
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateServiceDto: UpdateServiceDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.serviceService.update(id, updateServiceDto, file);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete service' })
  @ApiParam({ name: 'id', description: 'Service ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Service deleted successfully',
    schema: {
      example: {
        message: 'Service with ID 1 has been deleted successfully',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Service not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Service with ID 999 not found',
        error: 'Not Found',
      },
    },
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.serviceService.remove(id);
  }
}
