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
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { CreateProjectTypeDto } from './dto/create-project-type.dto';
import { UpdateProjectTypeDto } from './dto/update-project-type.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('projects')
@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  // ==================== PROJECT TYPE ENDPOINTS ====================

  @Get('types')
  @Public()
  @ApiOperation({ summary: 'Get all project types' })
  @ApiResponse({
    status: 200,
    description: 'Project types retrieved successfully',
    schema: {
      example: [
        {
          id: 1,
          title: 'Web Application',
          _count: {
            projects: 5,
          },
        },
        {
          id: 2,
          title: 'Mobile Application',
          _count: {
            projects: 3,
          },
        },
      ],
    },
  })
  findAllProjectTypes() {
    return this.projectService.findAllProjectTypes();
  }

  @Post('types')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new project type' })
  @ApiResponse({
    status: 201,
    description: 'Project type created successfully',
    schema: {
      example: {
        id: 1,
        title: 'Web Application',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 409,
    description: 'Project type with this title already exists',
    schema: {
      example: {
        statusCode: 409,
        message: 'Project type with title "Web Application" already exists',
        error: 'Conflict',
      },
    },
  })
  createProjectType(@Body() createProjectTypeDto: CreateProjectTypeDto) {
    return this.projectService.createProjectType(createProjectTypeDto);
  }

  @Patch('types/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a project type' })
  @ApiParam({ name: 'id', description: 'Project type ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Project type updated successfully',
    schema: {
      example: {
        id: 1,
        title: 'Web Application (Updated)',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Project type not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Project type with ID 999 not found',
        error: 'Not Found',
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Project type with this title already exists',
  })
  updateProjectType(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProjectTypeDto: UpdateProjectTypeDto,
  ) {
    return this.projectService.updateProjectType(id, updateProjectTypeDto);
  }

  // ==================== PROJECT ENDPOINTS ====================

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: 'Create a new project' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
          description: 'Project image',
        },
        title: { type: 'string', example: 'E-Commerce Platform' },
        subtitle: { type: 'string', example: 'Full-stack online shopping solution' },
        typeId: { type: 'number', example: 1, description: 'Project type ID' },
        frontendTechs: {
          type: 'array',
          items: { type: 'string' },
          example: ['React', 'TypeScript', 'Tailwind CSS'],
        },
        backendTechs: {
          type: 'array',
          items: { type: 'string' },
          example: ['Node.js', 'NestJS', 'PostgreSQL'],
        },
        devopsTechs: {
          type: 'array',
          items: { type: 'string' },
          example: ['Docker', 'AWS', 'GitHub Actions'],
        },
        designTechs: { type: 'array', items: { type: 'string' }, example: ['Figma', 'Adobe XD'] },
        othersTechs: {
          type: 'array',
          items: { type: 'string' },
          example: ['Redis', 'Elasticsearch'],
        },
        keyAccomplishments: {
          type: 'array',
          items: { type: 'string' },
          example: ['Increased sales by 40%', 'Reduced load time by 60%'],
        },
        projectOverview: { type: 'string', example: 'A comprehensive e-commerce platform' },
        problems: { type: 'object', example: { scalability: 'High traffic handling' } },
        solutions: { type: 'object', example: { scalability: 'Implemented load balancing' } },
        solutionArchitecture: { type: 'object', example: { architecture: 'Microservices' } },
        challenges: { type: 'object', example: { technical: 'Complex payment integration' } },
        timeline: { type: 'string', example: '6 months' },
        role: { type: 'string', example: 'Full-stack Developer' },
        totalMemberWorked: { type: 'number', example: 5 },
        outcome: { type: 'string', example: 'Successfully launched with 10K+ active users' },
        isFeatured: { type: 'boolean', example: false, description: 'Mark project as featured' },
        liveUrl: { type: 'string', example: 'https://ecommerce-demo.com' },
        githubUrl: { type: 'string', example: 'https://github.com/username/ecommerce-platform' },
      },
      required: ['title', 'typeId'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Project created successfully',
    schema: {
      example: {
        id: 1,
        title: 'E-Commerce Platform',
        subtitle: 'Full-stack online shopping solution',
        typeId: 1,
        type: {
          id: 1,
          title: 'Web Application',
        },
        imageURL:
          'https://res.cloudinary.com/demo/image/upload/v1234567890/portfolio/projects/ecommerce.png',
        frontendTechs: ['React', 'TypeScript', 'Tailwind CSS'],
        backendTechs: ['Node.js', 'NestJS', 'PostgreSQL'],
        devopsTechs: ['Docker', 'AWS', 'GitHub Actions'],
        designTechs: ['Figma', 'Adobe XD'],
        othersTechs: ['Redis', 'Elasticsearch'],
        keyAccomplishments: ['Increased sales by 40%', 'Reduced load time by 60%'],
        projectOverview: 'A comprehensive e-commerce platform with advanced features',
        problems: { scalability: 'High traffic handling', performance: 'Slow queries' },
        solutions: {
          scalability: 'Implemented load balancing',
          performance: 'Optimized database queries',
        },
        solutionArchitecture: {
          architecture: 'Microservices',
          database: 'PostgreSQL with Redis cache',
        },
        challenges: { technical: 'Complex payment integration', business: 'Tight deadlines' },
        timeline: '6 months',
        role: 'Full-stack Developer',
        totalMemberWorked: 5,
        outcome: 'Successfully launched with 10K+ active users',
        isFeatured: false,
        liveUrl: 'https://ecommerce-demo.com',
        githubUrl: 'https://github.com/username/ecommerce-platform',
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
  create(@Body() createProjectDto: CreateProjectDto, @UploadedFile() file?: Express.Multer.File) {
    return this.projectService.create(createProjectDto, file);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all projects' })
  @ApiResponse({
    status: 200,
    description: 'Projects retrieved successfully',
    schema: {
      example: [
        {
          id: 1,
          title: 'E-Commerce Platform',
          subtitle: 'Full-stack online shopping solution',
          typeId: 1,
          type: {
            id: 1,
            title: 'Web Application',
          },
          imageURL:
            'https://res.cloudinary.com/demo/image/upload/v1234567890/portfolio/projects/ecommerce.png',
          frontendTechs: ['React', 'TypeScript', 'Tailwind CSS'],
          backendTechs: ['Node.js', 'NestJS', 'PostgreSQL'],
          devopsTechs: ['Docker', 'AWS', 'GitHub Actions'],
          designTechs: ['Figma'],
          othersTechs: ['Redis'],
          keyAccomplishments: ['Increased sales by 40%'],
          projectOverview: 'A comprehensive e-commerce platform',
          problems: {},
          solutions: {},
          solutionArchitecture: {},
          challenges: {},
          timeline: '6 months',
          role: 'Full-stack Developer',
          totalMemberWorked: 5,
          outcome: 'Successfully launched with 10K+ active users',
          isFeatured: false,
          liveUrl: 'https://ecommerce-demo.com',
          githubUrl: 'https://github.com/username/ecommerce-platform',
        },
      ],
    },
  })
  findAll() {
    return this.projectService.findAll();
  }

  @Get('featured/list')
  @Public()
  @ApiOperation({ summary: 'Get featured projects (max 3)' })
  @ApiResponse({
    status: 200,
    description: 'Featured projects retrieved successfully',
    schema: {
      example: [
        {
          id: 1,
          title: 'E-Commerce Platform',
          subtitle: 'Full-stack online shopping solution',
          typeId: 1,
          type: {
            id: 1,
            title: 'Web Application',
          },
          imageURL:
            'https://res.cloudinary.com/demo/image/upload/v1234567890/portfolio/projects/ecommerce.png',
          frontendTechs: ['React', 'TypeScript', 'Tailwind CSS'],
          backendTechs: ['Node.js', 'NestJS', 'PostgreSQL'],
          devopsTechs: ['Docker', 'AWS', 'GitHub Actions'],
          designTechs: ['Figma'],
          othersTechs: ['Redis'],
          keyAccomplishments: ['Increased sales by 40%'],
          projectOverview: 'A comprehensive e-commerce platform',
          problems: {},
          solutions: {},
          solutionArchitecture: {},
          challenges: {},
          timeline: '6 months',
          role: 'Full-stack Developer',
          totalMemberWorked: 5,
          outcome: 'Successfully launched with 10K+ active users',
          isFeatured: true,
          liveUrl: 'https://ecommerce-demo.com',
          githubUrl: 'https://github.com/username/ecommerce-platform',
        },
      ],
    },
  })
  findFeaturedProjects() {
    return this.projectService.findFeaturedProjects();
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get project by ID' })
  @ApiParam({ name: 'id', description: 'Project ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Project retrieved successfully',
    schema: {
      example: {
        id: 1,
        title: 'E-Commerce Platform',
        subtitle: 'Full-stack online shopping solution',
        typeId: 1,
        type: {
          id: 1,
          title: 'Web Application',
        },
        imageURL:
          'https://res.cloudinary.com/demo/image/upload/v1234567890/portfolio/projects/ecommerce.png',
        frontendTechs: ['React', 'TypeScript', 'Tailwind CSS'],
        backendTechs: ['Node.js', 'NestJS', 'PostgreSQL'],
        devopsTechs: ['Docker', 'AWS'],
        designTechs: ['Figma'],
        othersTechs: ['Redis'],
        keyAccomplishments: ['Increased sales by 40%'],
        projectOverview: 'A comprehensive e-commerce platform',
        problems: { scalability: 'High traffic handling' },
        solutions: { scalability: 'Implemented load balancing' },
        solutionArchitecture: { architecture: 'Microservices' },
        challenges: { technical: 'Complex payment integration' },
        timeline: '6 months',
        role: 'Full-stack Developer',
        totalMemberWorked: 5,
        outcome: 'Successfully launched with 10K+ active users',
        isFeatured: false,
        liveUrl: 'https://ecommerce-demo.com',
        githubUrl: 'https://github.com/username/ecommerce-platform',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Project not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Project with ID 999 not found',
        error: 'Not Found',
      },
    },
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.projectService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: 'Update project' })
  @ApiParam({ name: 'id', description: 'Project ID', type: Number })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: { type: 'string', format: 'binary' },
        title: { type: 'string' },
        subtitle: { type: 'string' },
        typeId: { type: 'number', description: 'Project type ID' },
        frontendTechs: { type: 'array', items: { type: 'string' } },
        backendTechs: { type: 'array', items: { type: 'string' } },
        devopsTechs: { type: 'array', items: { type: 'string' } },
        designTechs: { type: 'array', items: { type: 'string' } },
        othersTechs: { type: 'array', items: { type: 'string' } },
        keyAccomplishments: { type: 'array', items: { type: 'string' } },
        projectOverview: { type: 'string' },
        problems: { type: 'object' },
        solutions: { type: 'object' },
        solutionArchitecture: { type: 'object' },
        challenges: { type: 'object' },
        timeline: { type: 'string' },
        role: { type: 'string' },
        totalMemberWorked: { type: 'number' },
        outcome: { type: 'string' },
        isFeatured: { type: 'boolean', description: 'Mark project as featured' },
        liveUrl: { type: 'string' },
        githubUrl: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Project updated successfully',
    schema: {
      example: {
        id: 1,
        title: 'E-Commerce Platform (Updated)',
        subtitle: 'Full-stack online shopping solution',
        typeId: 1,
        type: {
          id: 1,
          title: 'Web Application',
        },
        imageURL:
          'https://res.cloudinary.com/demo/image/upload/v1234567890/portfolio/projects/ecommerce-updated.png',
        frontendTechs: ['React', 'Next.js', 'TypeScript'],
        backendTechs: ['Node.js', 'NestJS', 'PostgreSQL'],
        devopsTechs: ['Docker', 'AWS', 'Kubernetes'],
        designTechs: ['Figma'],
        othersTechs: ['Redis', 'RabbitMQ'],
        keyAccomplishments: ['Increased sales by 50%', 'Reduced load time by 70%'],
        projectOverview: 'Updated comprehensive e-commerce platform',
        problems: {},
        solutions: {},
        solutionArchitecture: {},
        challenges: {},
        timeline: '8 months',
        role: 'Lead Developer',
        totalMemberWorked: 7,
        outcome: 'Successfully serving 50K+ active users',
        isFeatured: true,
        liveUrl: 'https://ecommerce-demo-v2.com',
        githubUrl: 'https://github.com/username/ecommerce-platform-v2',
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
    description: 'Project not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Project with ID 999 not found',
        error: 'Not Found',
      },
    },
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProjectDto: UpdateProjectDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.projectService.update(id, updateProjectDto, file);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete project' })
  @ApiParam({ name: 'id', description: 'Project ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Project deleted successfully',
    schema: {
      example: {
        message: 'Project with ID 1 has been deleted successfully',
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
    description: 'Project not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Project with ID 999 not found',
        error: 'Not Found',
      },
    },
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.projectService.remove(id);
  }
}
