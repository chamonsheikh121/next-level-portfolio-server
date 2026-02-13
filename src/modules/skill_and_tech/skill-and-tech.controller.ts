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
import { SkillAndTechService } from './skill-and-tech.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { CreateTechnologyDto } from './dto/create-technology.dto';
import { UpdateTechnologyDto } from './dto/update-technology.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('skills-and-technologies')
@Controller('skill-and-tech')
export class SkillAndTechController {
  constructor(private readonly skillAndTechService: SkillAndTechService) {}

  // ==================== SKILL ENDPOINTS ====================

  @Post('skills')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new skill' })
  @ApiResponse({ 
    status: 201, 
    description: 'Skill created successfully',
    schema: {
      example: {
        success: true,
        message: 'Skill created successfully',
        data: {
          id: 1,
          name: 'Frontend Development',
          description: 'Building modern user interfaces',
          technologies: []
        }
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized',
    schema: {
      example: {
        success: false,
        statusCode: 401,
        timestamp: '2026-02-11T10:30:00.000Z',
        path: '/skill-and-tech/skills',
        method: 'POST',
        error: 'Unauthorized',
        message: 'Unauthorized'
      }
    }
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Skill with this name already exists',
    schema: {
      example: {
        success: false,
        statusCode: 409,
        timestamp: '2026-02-11T10:30:00.000Z',
        path: '/skill-and-tech/skills',
        method: 'POST',
        error: 'Conflict',
        message: 'Skill with name "Frontend Development" already exists'
      }
    }
  })
  createSkill(@Body() createSkillDto: CreateSkillDto) {
    return this.skillAndTechService.createSkill(createSkillDto);
  }

  @Patch('skills/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update a skill' })
  @ApiParam({ name: 'id', description: 'Skill ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Skill updated successfully',
    schema: {
      example: {
        success: true,
        message: 'Skill updated successfully',
        data: {
          id: 1,
          name: 'Frontend Development',
          description: 'Building modern user interfaces',
          technologies: []
        }
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized',
    schema: {
      example: {
        success: false,
        statusCode: 401,
        timestamp: '2026-02-11T10:30:00.000Z',
        path: '/skill-and-tech/skills/1',
        method: 'PATCH',
        error: 'Unauthorized',
        message: 'Unauthorized'
      }
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Skill not found',
    schema: {
      example: {
        success: false,
        statusCode: 404,
        timestamp: '2026-02-11T10:30:00.000Z',
        path: '/skill-and-tech/skills/999',
        method: 'PATCH',
        error: 'Not Found',
        message: 'Skill with ID 999 not found'
      }
    }
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Skill with this name already exists',
    schema: {
      example: {
        success: false,
        statusCode: 409,
        timestamp: '2026-02-11T10:30:00.000Z',
        path: '/skill-and-tech/skills/1',
        method: 'PATCH',
        error: 'Conflict',
        message: 'Skill with name "Frontend Development" already exists'
      }
    }
  })
  updateSkill(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSkillDto: UpdateSkillDto,
  ) {
    return this.skillAndTechService.updateSkill(id, updateSkillDto);
  }

  @Get('skills')
  @Public()
  @ApiOperation({ 
    summary: 'Get all skills with technologies',
    description: 'Get all skills along with all their technologies (public - no authentication required)'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Return all skills with technologies',
    schema: {
      example: {
        success: true,
        count: 2,
        data: [
          {
            id: 1,
            name: 'Frontend Development',
            description: 'Building modern user interfaces',
            technologies: [
              { id: 1, name: 'React', level: 90, skillId: 1 },
              { id: 2, name: 'Vue.js', level: 75, skillId: 1 }
            ]
          }
        ]
      }
    }
  })
  getAllSkills() {
    return this.skillAndTechService.getAllSkills();
  }

  // ==================== TECHNOLOGY ENDPOINTS ====================

  @Get('technologies')
  @Public()
  @ApiOperation({ 
    summary: 'Get all technologies',
    description: 'Get all technologies with their associated skills (public - no authentication required)'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Return all technologies',
    schema: {
      example: {
        success: true,
        count: 3,
        data: [
          {
            id: 1,
            name: 'React',
            level: 90,
            skillId: 1,
            skill: { id: 1, name: 'Frontend Development', description: 'Building modern user interfaces' }
          }
        ]
      }
    }
  })
  getAllTechnologies() {
    return this.skillAndTechService.getAllTechnologies();
  }

  @Post('technologies')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('icon'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create a new technology with optional icon upload' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['name', 'skillId'],
      properties: {
        icon: {
          type: 'string',
          format: 'binary',
          description: 'Technology icon (optional)',
        },
        name: { type: 'string', example: 'React' },
        level: { type: 'number', example: 85, description: 'Proficiency level (0-100)' },
        skillId: { type: 'number', example: 1, description: 'Skill ID this technology belongs to' },
      },
    },
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Technology created successfully',
    schema: {
      example: {
        success: true,
        message: 'Technology created successfully',
        data: {
          id: 1,
          name: 'React',
          level: 90,
          iconUrl: 'https://res.cloudinary.com/demo/image/upload/v1234567890/portfolio/technologies/react-icon.png',
          skillId: 1,
          skill: { id: 1, name: 'Frontend Development', description: 'Building modern user interfaces' }
        }
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized',
    schema: {
      example: {
        success: false,
        statusCode: 401,
        timestamp: '2026-02-11T10:30:00.000Z',
        path: '/skill-and-tech/technologies',
        method: 'POST',
        error: 'Unauthorized',
        message: 'Unauthorized'
      }
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Skill not found',
    schema: {
      example: {
        success: false,
        statusCode: 404,
        timestamp: '2026-02-11T10:30:00.000Z',
        path: '/skill-and-tech/technologies',
        method: 'POST',
        error: 'Not Found',
        message: 'Skill with ID 1 not found'
      }
    }
  })
  createTechnology(
    @Body() createTechnologyDto: CreateTechnologyDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.skillAndTechService.createTechnology(createTechnologyDto, file);
  }

  @Patch('technologies/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('icon'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Update a technology with optional icon upload' })
  @ApiParam({ name: 'id', description: 'Technology ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        icon: {
          type: 'string',
          format: 'binary',
          description: 'Technology icon (optional)',
        },
        name: { type: 'string', example: 'React' },
        level: { type: 'number', example: 95, description: 'Proficiency level (0-100)' },
        skillId: { type: 'number', example: 1, description: 'Skill ID this technology belongs to' },
      },
    },
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Technology updated successfully',
    schema: {
      example: {
        success: true,
        message: 'Technology updated successfully',
        data: {
          id: 1,
          name: 'React',
          level: 95,
          iconUrl: 'https://res.cloudinary.com/demo/image/upload/v1234567890/portfolio/technologies/react-icon.png',
          skillId: 1,
          skill: { id: 1, name: 'Frontend Development', description: 'Building modern user interfaces' }
        }
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized',
    schema: {
      example: {
        success: false,
        statusCode: 401,
        timestamp: '2026-02-11T10:30:00.000Z',
        path: '/skill-and-tech/technologies/1',
        method: 'PATCH',
        error: 'Unauthorized',
        message: 'Unauthorized'
      }
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Technology or Skill not found',
    schema: {
      example: {
        success: false,
        statusCode: 404,
        timestamp: '2026-02-11T10:30:00.000Z',
        path: '/skill-and-tech/technologies/999',
        method: 'PATCH',
        error: 'Not Found',
        message: 'Technology with ID 999 not found'
      }
    }
  })
  updateTechnology(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTechnologyDto: UpdateTechnologyDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.skillAndTechService.updateTechnology(id, updateTechnologyDto, file);
  }

  @Delete('technologies/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a technology' })
  @ApiParam({ name: 'id', description: 'Technology ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Technology deleted successfully',
    schema: {
      example: {
        success: true,
        message: 'Technology deleted successfully'
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized',
    schema: {
      example: {
        success: false,
        statusCode: 401,
        timestamp: '2026-02-11T10:30:00.000Z',
        path: '/skill-and-tech/technologies/1',
        method: 'DELETE',
        error: 'Unauthorized',
        message: 'Unauthorized'
      }
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Technology not found',
    schema: {
      example: {
        success: false,
        statusCode: 404,
        timestamp: '2026-02-11T10:30:00.000Z',
        path: '/skill-and-tech/technologies/999',
        method: 'DELETE',
        error: 'Not Found',
        message: 'Technology with ID 999 not found'
      }
    }
  })
  deleteTechnology(@Param('id', ParseIntPipe) id: number) {
    return this.skillAndTechService.deleteTechnology(id);
  }
}
