import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { AwardService } from './award.service';
import { CreateAwardDto } from './dto/create-award.dto';
import { UpdateAwardDto } from './dto/update-award.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('awards')
@Controller('awards')
export class AwardController {
  constructor(private readonly awardService: AwardService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: 'Create a new award record' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
          description: 'Award certificate or trophy image',
        },
        title: {
          type: 'string',
          example: 'Best Developer Award 2024',
        },
        subtitle: {
          type: 'string',
          example: 'Excellence in Software Development',
        },
        awardFrom: {
          type: 'string',
          example: 'Tech Excellence Foundation',
        },
        awardDate: {
          type: 'string',
          format: 'date-time',
          example: '2024-12-10T00:00:00.000Z',
        },
        description: {
          type: 'string',
          example: 'Recognized for outstanding contributions to open-source projects',
        },
        imageURL: {
          type: 'string',
          example: 'https://example.com/award-certificate.png',
          description: 'Alternative to uploading image file',
        },
      },
      required: ['title'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Award record created successfully',
    schema: {
      example: {
        id: 1,
        imageURL:
          'https://res.cloudinary.com/demo/image/upload/v1234567890/portfolio/awards/certificate.png',
        title: 'Best Developer Award 2024',
        subtitle: 'Excellence in Software Development',
        awardFrom: 'Tech Excellence Foundation',
        awardDate: '2024-12-10T00:00:00.000Z',
        description: 'Recognized for outstanding contributions to open-source projects',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    schema: {
      example: {
        statusCode: 400,
        message: 'Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed',
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
  create(@Body() createAwardDto: CreateAwardDto, @UploadedFile() file?: Express.Multer.File) {
    return this.awardService.create(createAwardDto, file);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all award records' })
  @ApiResponse({
    status: 200,
    description: 'Award records retrieved successfully',
    schema: {
      example: [
        {
          id: 1,
          imageURL:
            'https://res.cloudinary.com/demo/image/upload/v1234567890/portfolio/awards/certificate.png',
          title: 'Best Developer Award 2024',
          subtitle: 'Excellence in Software Development',
          awardFrom: 'Tech Excellence Foundation',
          awardDate: '2024-12-10T00:00:00.000Z',
          description: 'Recognized for outstanding contributions to open-source projects',
        },
        {
          id: 2,
          imageURL:
            'https://res.cloudinary.com/demo/image/upload/v1234567890/portfolio/awards/trophy.png',
          title: 'Innovator of the Year 2023',
          subtitle: 'Technology Innovation',
          awardFrom: 'Global Tech Summit',
          awardDate: '2023-11-15T00:00:00.000Z',
          description: 'For developing groundbreaking AI solutions',
        },
      ],
    },
  })
  findAll() {
    return this.awardService.findAll();
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get award record by ID' })
  @ApiParam({ name: 'id', description: 'Award record ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Award record retrieved successfully',
    schema: {
      example: {
        id: 1,
        imageURL:
          'https://res.cloudinary.com/demo/image/upload/v1234567890/portfolio/awards/certificate.png',
        title: 'Best Developer Award 2024',
        subtitle: 'Excellence in Software Development',
        awardFrom: 'Tech Excellence Foundation',
        awardDate: '2024-12-10T00:00:00.000Z',
        description: 'Recognized for outstanding contributions to open-source projects',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Award record not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Award record with ID 999 not found',
        error: 'Not Found',
      },
    },
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.awardService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: 'Update award record' })
  @ApiParam({ name: 'id', description: 'Award record ID', type: Number })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
          description: 'Award certificate or trophy image',
        },
        title: {
          type: 'string',
          example: 'Best Developer Award 2024',
        },
        subtitle: {
          type: 'string',
          example: 'Excellence in Software Development',
        },
        awardFrom: {
          type: 'string',
          example: 'Tech Excellence Foundation',
        },
        awardDate: {
          type: 'string',
          format: 'date-time',
          example: '2024-12-10T00:00:00.000Z',
        },
        description: {
          type: 'string',
          example: 'Recognized for outstanding contributions to open-source projects',
        },
        imageURL: {
          type: 'string',
          example: 'https://example.com/award-certificate.png',
          description: 'Alternative to uploading image file',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Award record updated successfully',
    schema: {
      example: {
        id: 1,
        imageURL:
          'https://res.cloudinary.com/demo/image/upload/v1234567890/portfolio/awards/certificate-updated.png',
        title: 'Best Developer Award 2024 (Updated)',
        subtitle: 'Excellence in Software Development',
        awardFrom: 'Tech Excellence Foundation',
        awardDate: '2024-12-10T00:00:00.000Z',
        description: 'Updated: Recognized for outstanding contributions to open-source projects',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    schema: {
      example: {
        statusCode: 400,
        message: 'File size exceeds 5MB limit',
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
  @ApiResponse({
    status: 404,
    description: 'Award record not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Award record with ID 999 not found',
        error: 'Not Found',
      },
    },
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAwardDto: UpdateAwardDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.awardService.update(id, updateAwardDto, file);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete award record' })
  @ApiParam({ name: 'id', description: 'Award record ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Award record deleted successfully',
    schema: {
      example: {
        message: 'Award record with ID 1 has been deleted successfully',
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
    description: 'Award record not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Award record with ID 999 not found',
        error: 'Not Found',
      },
    },
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.awardService.remove(id);
  }
}
