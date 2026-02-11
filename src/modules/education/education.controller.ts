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
import { EducationService } from './education.service';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('education')
@Controller('education')
export class EducationController {
  constructor(private readonly educationService: EducationService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: 'Create a new education record' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
          description: 'Institution logo or certificate image',
        },
        title: {
          type: 'string',
          example: 'Bachelor of Science in Computer Science',
        },
        institution: {
          type: 'string',
          example: 'Massachusetts Institute of Technology',
        },
        location: {
          type: 'string',
          example: 'Cambridge, MA, USA',
        },
        graduationDate: {
          type: 'string',
          format: 'date-time',
          example: '2024-05-15T00:00:00.000Z',
        },
        description: {
          type: 'string',
          example: 'Graduated with honors. GPA: 3.9/4.0',
        },
        imageURL: {
          type: 'string',
          example: 'https://example.com/logo.png',
          description: 'Alternative to uploading image file',
        },
      },
      required: ['title', 'institution'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Education record created successfully',
    schema: {
      example: {
        id: 1,
        imageURL:
          'https://res.cloudinary.com/demo/image/upload/v1234567890/portfolio/education/mit-logo.png',
        title: 'Bachelor of Science in Computer Science',
        institution: 'Massachusetts Institute of Technology',
        location: 'Cambridge, MA, USA',
        graduationDate: '2024-05-15T00:00:00.000Z',
        description: 'Graduated with honors. GPA: 3.9/4.0',
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
  create(
    @Body() createEducationDto: CreateEducationDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.educationService.create(createEducationDto, file);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all education records' })
  @ApiResponse({
    status: 200,
    description: 'Education records retrieved successfully',
    schema: {
      example: [
        {
          id: 1,
          imageURL:
            'https://res.cloudinary.com/demo/image/upload/v1234567890/portfolio/education/mit-logo.png',
          title: 'Bachelor of Science in Computer Science',
          institution: 'Massachusetts Institute of Technology',
          location: 'Cambridge, MA, USA',
          graduationDate: '2024-05-15T00:00:00.000Z',
          description: 'Graduated with honors. GPA: 3.9/4.0',
        },
        {
          id: 2,
          imageURL:
            'https://res.cloudinary.com/demo/image/upload/v1234567890/portfolio/education/stanford-logo.png',
          title: 'Master of Science in Artificial Intelligence',
          institution: 'Stanford University',
          location: 'Stanford, CA, USA',
          graduationDate: '2023-06-10T00:00:00.000Z',
          description: 'Specialization in Machine Learning and Deep Learning',
        },
      ],
    },
  })
  findAll() {
    return this.educationService.findAll();
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get education record by ID' })
  @ApiParam({ name: 'id', description: 'Education record ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Education record retrieved successfully',
    schema: {
      example: {
        id: 1,
        imageURL:
          'https://res.cloudinary.com/demo/image/upload/v1234567890/portfolio/education/mit-logo.png',
        title: 'Bachelor of Science in Computer Science',
        institution: 'Massachusetts Institute of Technology',
        location: 'Cambridge, MA, USA',
        graduationDate: '2024-05-15T00:00:00.000Z',
        description: 'Graduated with honors. GPA: 3.9/4.0',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Education record not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Education record with ID 999 not found',
        error: 'Not Found',
      },
    },
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.educationService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: 'Update education record' })
  @ApiParam({ name: 'id', description: 'Education record ID', type: Number })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
          description: 'Institution logo or certificate image',
        },
        title: {
          type: 'string',
          example: 'Bachelor of Science in Computer Science',
        },
        institution: {
          type: 'string',
          example: 'Massachusetts Institute of Technology',
        },
        location: {
          type: 'string',
          example: 'Cambridge, MA, USA',
        },
        graduationDate: {
          type: 'string',
          format: 'date-time',
          example: '2024-05-15T00:00:00.000Z',
        },
        description: {
          type: 'string',
          example: 'Graduated with honors. GPA: 3.9/4.0',
        },
        imageURL: {
          type: 'string',
          example: 'https://example.com/logo.png',
          description: 'Alternative to uploading image file',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Education record updated successfully',
    schema: {
      example: {
        id: 1,
        imageURL:
          'https://res.cloudinary.com/demo/image/upload/v1234567890/portfolio/education/mit-logo-updated.png',
        title: 'Bachelor of Science in Computer Science (Updated)',
        institution: 'Massachusetts Institute of Technology',
        location: 'Cambridge, MA, USA',
        graduationDate: '2024-05-15T00:00:00.000Z',
        description: 'Graduated with highest honors. GPA: 4.0/4.0',
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
    description: 'Education record not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Education record with ID 999 not found',
        error: 'Not Found',
      },
    },
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEducationDto: UpdateEducationDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.educationService.update(id, updateEducationDto, file);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete education record' })
  @ApiParam({ name: 'id', description: 'Education record ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Education record deleted successfully',
    schema: {
      example: {
        message: 'Education record with ID 1 has been deleted successfully',
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
    description: 'Education record not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Education record with ID 999 not found',
        error: 'Not Found',
      },
    },
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.educationService.remove(id);
  }
}
