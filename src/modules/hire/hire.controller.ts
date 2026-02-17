import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { HireService } from './hire.service';
import { CreateHireRequestDto } from './dto/create-hire-request.dto';
import { UpdateHireRequestDto } from './dto/update-hire-request.dto';
import { UpdateHireStatusDto } from './dto/update-status.dto';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('hire-requests')
@Controller('hire-requests')
export class HireController {
  constructor(private readonly hireService: HireService) {}

  @Post()
  @Public()
  @ApiOperation({ summary: 'Create a new hire request (email required)' })
  @ApiResponse({
    status: 201,
    description: 'Hire request created successfully',
    schema: {
      example: {
        statusCode: 201,
        message: 'Hire request created successfully',
        data: {
          id: 1,
          name: 'John Doe',
          companyName: 'Tech Corp',
          email: 'client@example.com',
          linkedinUrl: 'https://linkedin.com/in/johndoe',
          notes: 'Looking forward to collaboration',
          status: 'unread',
          projectDesc: 'Build a modern e-commerce platform',
          serviceId: 1,
          estimateBudget: '$10,000 - $20,000',
          expectedTimeline: '2-3 months',
          budget: '$50,000',
          timeline: '6 months',
          additionalinfo: 'Need responsive design and mobile app',
          coreFeatures: ['User authentication', 'Payment integration'],
          techSuggestion: ['React', 'Node.js', 'PostgreSQL'],
          files: [],
          createdAt: '2026-02-17T10:30:00.000Z',
          updatedAt: '2026-02-17T10:30:00.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Email is required',
    schema: {
      example: {
        statusCode: 400,
        message: ['email should not be empty', 'email must be an email'],
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Failed to create hire request',
    schema: {
      example: {
        statusCode: 500,
        message: 'Failed to create hire request',
        error: 'Internal server error',
      },
    },
  })
  create(@Body() createHireRequestDto: CreateHireRequestDto) {
    return this.hireService.create(createHireRequestDto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all hire requests' })
  @ApiResponse({
    status: 200,
    description: 'Hire requests retrieved successfully',
    schema: {
      example: {
        statusCode: 200,
        message: 'Hire requests retrieved successfully',
        data: [
          {
            id: 1,
            name: 'John Doe',
            companyName: 'Tech Corp',
            email: 'client@example.com',
            linkedinUrl: 'https://linkedin.com/in/johndoe',
            notes: 'Looking forward to collaboration',
            status: 'unread',
            projectDesc: 'Build a modern e-commerce platform',
            serviceId: 1,
            estimateBudget: '$10,000 - $20,000',
            expectedTimeline: '2-3 months',
            budget: '$50,000',
            timeline: '6 months',
            additionalinfo: 'Need responsive design and mobile app',
            coreFeatures: ['User authentication', 'Payment integration'],
            techSuggestion: ['React', 'Node.js', 'PostgreSQL'],
            files: [],
            createdAt: '2026-02-17T10:30:00.000Z',
            updatedAt: '2026-02-17T10:30:00.000Z',
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Failed to retrieve hire requests',
    schema: {
      example: {
        statusCode: 500,
        message: 'Failed to retrieve hire requests',
        error: 'Internal server error',
      },
    },
  })
  findAll() {
    return this.hireService.findAll();
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get a hire request by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'Hire request ID' })
  @ApiResponse({
    status: 200,
    description: 'Hire request retrieved successfully',
    schema: {
      example: {
        statusCode: 200,
        message: 'Hire request retrieved successfully',
        data: {
          id: 1,
          name: 'John Doe',
          companyName: 'Tech Corp',
          email: 'client@example.com',
          linkedinUrl: 'https://linkedin.com/in/johndoe',
          notes: 'Looking forward to collaboration',
          status: 'unread',
          projectDesc: 'Build a modern e-commerce platform',
          serviceId: 1,
          estimateBudget: '$10,000 - $20,000',
          expectedTimeline: '2-3 months',
          budget: '$50,000',
          timeline: '6 months',
          additionalinfo: 'Need responsive design and mobile app',
          coreFeatures: ['User authentication', 'Payment integration'],
          techSuggestion: ['React', 'Node.js', 'PostgreSQL'],
          files: [],
          createdAt: '2026-02-17T10:30:00.000Z',
          updatedAt: '2026-02-17T10:30:00.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Hire request not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Hire request with ID 1 not found',
      },
    },
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.hireService.findOne(id);
  }

  @Patch(':id')
  @Public()
  @UseInterceptors(FilesInterceptor('files', 10))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Update a hire request with optional file uploads',
  })
  @ApiParam({ name: 'id', type: 'number', description: 'Hire request ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description:
            'Files to upload (PDF, DOC, DOCX, ZIP, TXT, PNG, JPG, JPEG, GIF, WebP - max 10 files, 10MB each)',
        },
        name: { type: 'string', example: 'John Doe' },
        companyName: { type: 'string', example: 'Tech Corp' },
        email: { type: 'string', example: 'client@example.com' },
        linkedinUrl: {
          type: 'string',
          example: 'https://linkedin.com/in/johndoe',
        },
        notes: { type: 'string', example: 'Updated notes' },
        projectDesc: {
          type: 'string',
          example: 'Updated project description',
        },
        serviceId: { type: 'number', example: 1 },
        estimateBudget: { type: 'string', example: '$15,000 - $25,000' },
        expectedTimeline: { type: 'string', example: '3-4 months' },
        budget: { type: 'string', example: '$60,000' },
        timeline: { type: 'string', example: '8 months' },
        additionalinfo: {
          type: 'string',
          example: 'Updated additional information',
        },
        coreFeatures: {
          type: 'string',
          example: '["User authentication", "Payment integration"]',
          description: 'JSON array string',
        },
        techSuggestion: {
          type: 'string',
          example: '["React", "Node.js"]',
          description: 'JSON array string',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Hire request updated successfully',
    schema: {
      example: {
        statusCode: 200,
        message: 'Hire request updated successfully',
        data: {
          id: 1,
          name: 'John Doe Updated',
          companyName: 'Tech Corp',
          email: 'client@example.com',
          linkedinUrl: 'https://linkedin.com/in/johndoe',
          notes: 'Updated notes',
          status: 'unread',
          projectDesc: 'Updated project description',
          serviceId: 1,
          estimateBudget: '$15,000 - $25,000',
          expectedTimeline: '3-4 months',
          budget: '$60,000',
          timeline: '8 months',
          additionalinfo: 'Updated additional information',
          coreFeatures: ['User authentication', 'Payment integration'],
          techSuggestion: ['React', 'Node.js'],
          files: [
            {
              id: 1,
              url: 'https://res.cloudinary.com/demo/raw/upload/v1234567890/portfolio/hire-requests/document.pdf',
              publicId: 'portfolio/hire-requests/document',
              format: 'pdf',
              resourceType: 'raw',
              bytes: 245632,
              hireRequestId: 1,
              createdAt: '2026-02-17T11:00:00.000Z',
              updatedAt: '2026-02-17T11:00:00.000Z',
            },
            {
              id: 2,
              url: 'https://res.cloudinary.com/demo/raw/upload/v1234567891/portfolio/hire-requests/proposal.docx',
              publicId: 'portfolio/hire-requests/proposal',
              format: 'docx',
              resourceType: 'raw',
              bytes: 123456,
              hireRequestId: 1,
              createdAt: '2026-02-17T11:00:00.000Z',
              updatedAt: '2026-02-17T11:00:00.000Z',
            },
          ],
          createdAt: '2026-02-17T10:30:00.000Z',
          updatedAt: '2026-02-17T11:00:00.000Z',
        },
        uploadedFiles: [
          {
            id: 2,
            url: 'https://res.cloudinary.com/demo/raw/upload/v1234567891/portfolio/hire-requests/proposal.docx',
            publicId: 'portfolio/hire-requests/proposal',
            format: 'docx',
            resourceType: 'raw',
            bytes: 123456,
            hireRequestId: 1,
            createdAt: '2026-02-17T11:00:00.000Z',
            updatedAt: '2026-02-17T11:00:00.000Z',
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Hire request not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Hire request with ID 1 not found',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Failed to update hire request',
    schema: {
      example: {
        statusCode: 500,
        message: 'Failed to update hire request',
        error: 'Internal server error',
      },
    },
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateHireRequestDto: UpdateHireRequestDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    return this.hireService.update(id, updateHireRequestDto, files);
  }

  @Patch(':id/status')
  @Public()
  @ApiOperation({ summary: 'Update hire request status' })
  @ApiParam({ name: 'id', type: 'number', description: 'Hire request ID' })
  @ApiResponse({
    status: 200,
    description: 'Hire request status updated successfully',
    schema: {
      example: {
        statusCode: 200,
        message: 'Hire request status updated successfully',
        data: {
          id: 1,
          name: 'John Doe',
          companyName: 'Tech Corp',
          email: 'client@example.com',
          linkedinUrl: 'https://linkedin.com/in/johndoe',
          notes: 'Looking forward to collaboration',
          status: 'read',
          projectDesc: 'Build a modern e-commerce platform',
          serviceId: 1,
          estimateBudget: '$10,000 - $20,000',
          expectedTimeline: '2-3 months',
          budget: '$50,000',
          timeline: '6 months',
          additionalinfo: 'Need responsive design and mobile app',
          coreFeatures: ['User authentication', 'Payment integration'],
          techSuggestion: ['React', 'Node.js', 'PostgreSQL'],
          files: [],
          createdAt: '2026-02-17T10:30:00.000Z',
          updatedAt: '2026-02-17T11:30:00.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Hire request not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Hire request with ID 1 not found',
      },
    },
  })
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateHireStatusDto: UpdateHireStatusDto,
  ) {
    return this.hireService.updateStatus(id, updateHireStatusDto.status);
  }

  @Delete(':id')
  @Public()
  @ApiOperation({ summary: 'Delete a hire request' })
  @ApiParam({ name: 'id', type: 'number', description: 'Hire request ID' })
  @ApiResponse({
    status: 200,
    description: 'Hire request deleted successfully',
    schema: {
      example: {
        statusCode: 200,
        message: 'Hire request deleted successfully',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Hire request not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Hire request with ID 1 not found',
      },
    },
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.hireService.remove(id);
  }
}
