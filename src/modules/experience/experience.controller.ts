import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { ExperienceService } from './experience.service';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('experience')
@Controller('experience')
export class ExperienceController {
  constructor(private readonly experienceService: ExperienceService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create a new experience with optional image upload' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['title', 'company', 'startingDate'],
      properties: {
        image: {
          type: 'string',
          format: 'binary',
          description: 'Experience company logo (optional, max 5MB)',
        },
        title: { type: 'string', example: 'Senior Full Stack Developer' },
        company: { type: 'string', example: 'Tech Solutions Inc.' },
        location: { type: 'string', example: 'San Francisco, CA' },
        startingDate: { type: 'string', format: 'date-time', example: '2023-01-15T00:00:00.000Z' },
        endingDate: { type: 'string', format: 'date-time', example: '2024-12-31T00:00:00.000Z', description: 'Leave empty for current position' },
        description: { type: 'string', example: 'Led development of scalable applications' },
        keyAchievements: { 
          type: 'string',
          example: '["Increased performance by 40%", "Led team of 5 developers"]',
          description: 'JSON array string or comma-separated values'
        },
        technologies: {
          type: 'string',
          example: '["React", "Node.js", "PostgreSQL"]',
          description: 'JSON array string or comma-separated values'
        },
      },
    },
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Experience created successfully',
    schema: {
      example: {
        success: true,
        message: 'Experience created successfully',
        data: {
          id: 1,
          imageURL: 'https://res.cloudinary.com/demo/image/upload/v1234567890/portfolio/experiences/logo.png',
          title: 'Senior Full Stack Developer',
          company: 'Tech Solutions Inc.',
          location: 'San Francisco, CA',
          startingDate: '2023-01-15T00:00:00.000Z',
          endingDate: '2024-12-31T00:00:00.000Z',
          description: 'Led development of scalable applications',
          keyAchievements: ['Increased performance by 40%', 'Led team of 5 developers'],
          technologies: ['React', 'Node.js', 'PostgreSQL']
        }
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad Request - Invalid input data or file',
    schema: {
      example: {
        success: false,
        statusCode: 400,
        timestamp: '2026-02-11T10:30:00.000Z',
        path: '/experience',
        method: 'POST',
        error: 'Bad Request',
        message: 'Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed'
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - Authentication required',
    schema: {
      example: {
        success: false,
        statusCode: 401,
        timestamp: '2026-02-11T10:30:00.000Z',
        path: '/experience',
        method: 'POST',
        error: 'Unauthorized',
        message: 'Unauthorized'
      }
    }
  })
  createExperience(
    @Body() createExperienceDto: CreateExperienceDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.experienceService.createExperience(createExperienceDto, image);
  }

  @Get()
  @Public()
  @ApiOperation({ 
    summary: 'Get all experiences',
    description: 'Get all work experiences ordered by starting date (public - no authentication required)'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Return all experiences',
    schema: {
      example: {
        success: true,
        count: 2,
        data: [
          {
            id: 1,
            imageURL: 'https://example.com/logo.png',
            title: 'Senior Full Stack Developer',
            company: 'Tech Solutions Inc.',
            location: 'San Francisco, CA',
            startingDate: '2023-01-15T00:00:00.000Z',
            endingDate: null,
            description: 'Led development of scalable applications',
            keyAchievements: ['Increased performance by 40%'],
            technologies: ['React', 'Node.js']
          }
        ]
      }
    }
  })
  getAllExperiences() {
    return this.experienceService.getAllExperiences();
  }

  @Get(':id')
  @Public()
  @ApiOperation({ 
    summary: 'Get experience by ID',
    description: 'Get a single experience by its ID (public - no authentication required)'
  })
  @ApiParam({ name: 'id', description: 'Experience ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Return experience details',
    schema: {
      example: {
        success: true,
        data: {
          id: 1,
          imageURL: 'https://example.com/logo.png',
          title: 'Senior Full Stack Developer',
          company: 'Tech Solutions Inc.',
          location: 'San Francisco, CA',
          startingDate: '2023-01-15T00:00:00.000Z',
          endingDate: null,
          description: 'Led development of scalable applications',
          keyAchievements: ['Increased performance by 40%'],
          technologies: ['React', 'Node.js']
        }
      }
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Experience not found',
    schema: {
      example: {
        success: false,
        statusCode: 404,
        timestamp: '2026-02-11T10:30:00.000Z',
        path: '/experience/999',
        method: 'GET',
        error: 'Not Found',
        message: 'Experience with ID 999 not found'
      }
    }
  })
  getExperienceById(@Param('id', ParseIntPipe) id: number) {
    return this.experienceService.getExperienceById(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Update an experience with optional image upload' })
  @ApiParam({ name: 'id', description: 'Experience ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
          description: 'New experience company logo (optional, max 5MB)',
        },
        title: { type: 'string', example: 'Lead Full Stack Developer' },
        company: { type: 'string', example: 'Tech Solutions Inc.' },
        location: { type: 'string', example: 'San Francisco, CA' },
        startingDate: { type: 'string', format: 'date-time', example: '2023-01-15T00:00:00.000Z' },
        endingDate: { type: 'string', format: 'date-time', example: '2024-12-31T00:00:00.000Z' },
        description: { type: 'string', example: 'Led development of scalable applications' },
        keyAchievements: { 
          type: 'string',
          example: '["Increased performance by 40%", "Led team of 5 developers"]',
          description: 'JSON array string or comma-separated values'
        },
        technologies: {
          type: 'string',
          example: '["React", "Node.js", "PostgreSQL"]',
          description: 'JSON array string or comma-separated values'
        },
      },
    },
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Experience updated successfully',
    schema: {
      example: {
        success: true,
        message: 'Experience updated successfully',
        data: {
          id: 1,
          imageURL: 'https://res.cloudinary.com/demo/image/upload/v1234567890/portfolio/experiences/logo.png',
          title: 'Lead Full Stack Developer',
          company: 'Tech Solutions Inc.',
          location: 'San Francisco, CA',
          startingDate: '2023-01-15T00:00:00.000Z',
          endingDate: null,
          description: 'Led development of scalable applications',
          keyAchievements: ['Increased performance by 40%'],
          technologies: ['React', 'Node.js']
        }
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad Request - Invalid file',
    schema: {
      example: {
        success: false,
        statusCode: 400,
        timestamp: '2026-02-11T10:30:00.000Z',
        path: '/experience/1',
        method: 'PATCH',
        error: 'Bad Request',
        message: 'Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed'
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - Authentication required',
    schema: {
      example: {
        success: false,
        statusCode: 401,
        timestamp: '2026-02-11T10:30:00.000Z',
        path: '/experience/1',
        method: 'PATCH',
        error: 'Unauthorized',
        message: 'Unauthorized'
      }
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Experience not found',
    schema: {
      example: {
        success: false,
        statusCode: 404,
        timestamp: '2026-02-11T10:30:00.000Z',
        path: '/experience/999',
        method: 'PATCH',
        error: 'Not Found',
        message: 'Experience with ID 999 not found'
      }
    }
  })
  updateExperience(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateExperienceDto: UpdateExperienceDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.experienceService.updateExperience(id, updateExperienceDto, image);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete an experience' })
  @ApiParam({ name: 'id', description: 'Experience ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Experience deleted successfully',
    schema: {
      example: {
        success: true,
        message: 'Experience deleted successfully'
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - Authentication required',
    schema: {
      example: {
        success: false,
        statusCode: 401,
        timestamp: '2026-02-11T10:30:00.000Z',
        path: '/experience/1',
        method: 'DELETE',
        error: 'Unauthorized',
        message: 'Unauthorized'
      }
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Experience not found',
    schema: {
      example: {
        success: false,
        statusCode: 404,
        timestamp: '2026-02-11T10:30:00.000Z',
        path: '/experience/999',
        method: 'DELETE',
        error: 'Not Found',
        message: 'Experience with ID 999 not found'
      }
    }
  })
  deleteExperience(@Param('id', ParseIntPipe) id: number) {
    return this.experienceService.deleteExperience(id);
  }
}
