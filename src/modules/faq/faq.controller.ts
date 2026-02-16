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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { FaqService } from './faq.service';
import { CreateFaqCategoryDto } from './dto/create-faq-category.dto';
import { UpdateFaqCategoryDto } from './dto/update-faq-category.dto';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('faqs')
@Controller('faqs')
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  // FAQ Category endpoints
  @Post('categories')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new FAQ category' })
  @ApiResponse({
    status: 201,
    description: 'FAQ category created successfully',
    schema: {
      example: {
        id: 1,
        title: 'General Questions',
      },
    },
  })
  createCategory(@Body() createFaqCategoryDto: CreateFaqCategoryDto) {
    return this.faqService.createCategory(createFaqCategoryDto);
  }

  @Get('categories')
  @Public()
  @ApiOperation({ summary: 'Get all FAQ categories' })
  @ApiResponse({
    status: 200,
    description: 'FAQ categories retrieved successfully',
    schema: {
      example: [
        {
          id: 1,
          title: 'General Questions',
          _count: {
            faqs: 5,
          },
        },
      ],
    },
  })
  findAllCategories() {
    return this.faqService.findAllCategories();
  }

  @Get('categories/:id')
  @Public()
  @ApiOperation({ summary: 'Get FAQ category by ID' })
  @ApiParam({ name: 'id', description: 'FAQ Category ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'FAQ category retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'FAQ category not found',
  })
  findOneCategory(@Param('id', ParseIntPipe) id: number) {
    return this.faqService.findOneCategory(id);
  }

  @Patch('categories/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update FAQ category' })
  @ApiParam({ name: 'id', description: 'FAQ Category ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'FAQ category updated successfully',
  })
  updateCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFaqCategoryDto: UpdateFaqCategoryDto,
  ) {
    return this.faqService.updateCategory(id, updateFaqCategoryDto);
  }

  @Delete('categories/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete FAQ category' })
  @ApiParam({ name: 'id', description: 'FAQ Category ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'FAQ category deleted successfully',
    schema: {
      example: {
        message: 'FAQ category with ID 1 has been deleted successfully',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'FAQ category has associated FAQs',
  })
  removeCategory(@Param('id', ParseIntPipe) id: number) {
    return this.faqService.removeCategory(id);
  }

  // FAQ endpoints
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new FAQ' })
  @ApiResponse({
    status: 201,
    description: 'FAQ created successfully',
    schema: {
      example: {
        id: 1,
        question: 'What services do you offer?',
        answer: 'I offer full-stack web development, mobile app development, and UI/UX design services.',
        categoryId: 1,
        category: {
          id: 1,
          title: 'General Questions',
        },
      },
    },
  })
  create(@Body() createFaqDto: CreateFaqDto) {
    return this.faqService.create(createFaqDto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all FAQs' })
  @ApiResponse({
    status: 200,
    description: 'FAQs retrieved successfully',
  })
  findAll() {
    return this.faqService.findAll();
  }

  @Get('category/:categoryId')
  @Public()
  @ApiOperation({ summary: 'Get all FAQs by category ID' })
  @ApiParam({ name: 'categoryId', description: 'FAQ Category ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'FAQs retrieved successfully',
    schema: {
      example: [
        {
          id: 1,
          question: 'What services do you offer?',
          answer: 'I offer full-stack web development services.',
          categoryId: 1,
          category: {
            id: 1,
            title: 'General Questions',
          },
        },
      ],
    },
  })
  @ApiResponse({
    status: 404,
    description: 'FAQ category not found',
  })
  findByCategory(@Param('categoryId', ParseIntPipe) categoryId: number) {
    return this.faqService.findByCategory(categoryId);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get FAQ by ID' })
  @ApiParam({ name: 'id', description: 'FAQ ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'FAQ retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'FAQ not found',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.faqService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update FAQ' })
  @ApiParam({ name: 'id', description: 'FAQ ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'FAQ updated successfully',
  })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateFaqDto: UpdateFaqDto) {
    return this.faqService.update(id, updateFaqDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete FAQ' })
  @ApiParam({ name: 'id', description: 'FAQ ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'FAQ deleted successfully',
    schema: {
      example: {
        message: 'FAQ with ID 1 has been deleted successfully',
      },
    },
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.faqService.remove(id);
  }
}
