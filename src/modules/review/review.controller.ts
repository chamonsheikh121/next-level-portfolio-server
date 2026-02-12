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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create a new review with optional avatar' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        avatar: {
          type: 'string',
          format: 'binary',
          description: 'Reviewer avatar image (optional)',
        },
        rate: { type: 'number', example: 5, minimum: 1, maximum: 5 },
        comment: { type: 'string', example: 'Excellent work! Very professional.' },
        name: { type: 'string', example: 'John Doe' },
        subtitle: { type: 'string', example: 'CEO at Tech Company' },
      },
      required: ['rate', 'name'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Review created successfully',
    schema: {
      example: {
        id: 1,
        rate: 5,
        comment: 'Excellent work! Very professional and delivered on time.',
        avatar: 'https://res.cloudinary.com/demo/image/upload/v1234567890/portfolio/reviews/avatar.png',
        name: 'John Doe',
        subtitle: 'CEO at Tech Company',
      },
    },
  })
  create(@Body() createReviewDto: CreateReviewDto, @UploadedFile() file?: Express.Multer.File) {
    return this.reviewService.create(createReviewDto, file);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all reviews' })
  @ApiResponse({
    status: 200,
    description: 'Reviews retrieved successfully',
    schema: {
      example: [
        {
          id: 1,
          rate: 5,
          comment: 'Excellent work!',
          avatar: 'https://example.com/avatar.png',
          name: 'John Doe',
          subtitle: 'CEO at Tech Company',
        },
      ],
    },
  })
  findAll() {
    return this.reviewService.findAll();
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get review by ID' })
  @ApiParam({ name: 'id', description: 'Review ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Review retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Review not found',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.reviewService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Update review' })
  @ApiParam({ name: 'id', description: 'Review ID', type: Number })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        avatar: { type: 'string', format: 'binary' },
        rate: { type: 'number', minimum: 1, maximum: 5 },
        comment: { type: 'string' },
        name: { type: 'string' },
        subtitle: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Review updated successfully',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateReviewDto: UpdateReviewDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.reviewService.update(id, updateReviewDto, file);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete review' })
  @ApiParam({ name: 'id', description: 'Review ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Review deleted successfully',
    schema: {
      example: {
        message: 'Review with ID 1 has been deleted successfully',
      },
    },
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.reviewService.remove(id);
  }
}
