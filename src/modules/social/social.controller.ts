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
import { SocialService } from './social.service';
import { CreateSocialDto } from './dto/create-social.dto';
import { UpdateSocialDto } from './dto/update-social.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('social')
@Controller('social')
export class SocialController {
  constructor(private readonly socialService: SocialService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: 'Create a new social account link' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
          description: 'Social platform icon or logo',
        },
        title: {
          type: 'string',
          example: 'GitHub',
        },
        url: {
          type: 'string',
          example: 'https://github.com/johndoe',
        },
        imageURL: {
          type: 'string',
          example: 'https://example.com/github-icon.png',
          description: 'Alternative to uploading image file',
        },
      },
      required: ['title', 'url'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Social account created successfully',
    schema: {
      example: {
        id: 1,
        imageURL:
          'https://res.cloudinary.com/demo/image/upload/v1234567890/portfolio/social/github-icon.png',
        title: 'GitHub',
        url: 'https://github.com/johndoe',
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
  create(@Body() createSocialDto: CreateSocialDto, @UploadedFile() file?: Express.Multer.File) {
    return this.socialService.create(createSocialDto, file);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all social account links' })
  @ApiResponse({
    status: 200,
    description: 'Social accounts retrieved successfully',
    schema: {
      example: [
        {
          id: 1,
          imageURL:
            'https://res.cloudinary.com/demo/image/upload/v1234567890/portfolio/social/github-icon.png',
          title: 'GitHub',
          url: 'https://github.com/johndoe',
        },
        {
          id: 2,
          imageURL:
            'https://res.cloudinary.com/demo/image/upload/v1234567890/portfolio/social/linkedin-icon.png',
          title: 'LinkedIn',
          url: 'https://linkedin.com/in/johndoe',
        },
        {
          id: 3,
          imageURL:
            'https://res.cloudinary.com/demo/image/upload/v1234567890/portfolio/social/twitter-icon.png',
          title: 'Twitter',
          url: 'https://twitter.com/johndoe',
        },
      ],
    },
  })
  findAll() {
    return this.socialService.findAll();
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get social account by ID' })
  @ApiParam({ name: 'id', description: 'Social account ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Social account retrieved successfully',
    schema: {
      example: {
        id: 1,
        imageURL:
          'https://res.cloudinary.com/demo/image/upload/v1234567890/portfolio/social/github-icon.png',
        title: 'GitHub',
        url: 'https://github.com/johndoe',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Social account not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Social account with ID 999 not found',
        error: 'Not Found',
      },
    },
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.socialService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: 'Update social account link' })
  @ApiParam({ name: 'id', description: 'Social account ID', type: Number })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
          description: 'Social platform icon or logo',
        },
        title: {
          type: 'string',
          example: 'GitHub',
        },
        url: {
          type: 'string',
          example: 'https://github.com/johndoe',
        },
        imageURL: {
          type: 'string',
          example: 'https://example.com/github-icon.png',
          description: 'Alternative to uploading image file',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Social account updated successfully',
    schema: {
      example: {
        id: 1,
        imageURL:
          'https://res.cloudinary.com/demo/image/upload/v1234567890/portfolio/social/github-icon-updated.png',
        title: 'GitHub (Updated)',
        url: 'https://github.com/johndoe-new',
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
    description: 'Social account not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Social account with ID 999 not found',
        error: 'Not Found',
      },
    },
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSocialDto: UpdateSocialDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.socialService.update(id, updateSocialDto, file);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete social account link' })
  @ApiParam({ name: 'id', description: 'Social account ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Social account deleted successfully',
    schema: {
      example: {
        message: 'Social account with ID 1 has been deleted successfully',
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
    description: 'Social account not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Social account with ID 999 not found',
        error: 'Not Found',
      },
    },
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.socialService.remove(id);
  }
}
