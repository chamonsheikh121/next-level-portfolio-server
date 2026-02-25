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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ClientProjectCategoryService } from './client-project-category.service';
import { CreateClientProjectCategoryDto } from './dto/create-client-project-category.dto';
import { UpdateClientProjectCategoryDto } from './dto/update-client-project-category.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Client Project Categories')
@Controller('client-project-categories')
export class ClientProjectCategoryController {
  constructor(private readonly clientProjectCategoryService: ClientProjectCategoryService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new client project category' })
  @ApiResponse({ status: 201, description: 'Category created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() createClientProjectCategoryDto: CreateClientProjectCategoryDto) {
    return this.clientProjectCategoryService.create(createClientProjectCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all client project categories' })
  @ApiResponse({ status: 200, description: 'Categories retrieved successfully' })
  findAll() {
    return this.clientProjectCategoryService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a client project category by ID' })
  @ApiResponse({ status: 200, description: 'Category retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.clientProjectCategoryService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a client project category' })
  @ApiResponse({ status: 200, description: 'Category updated successfully' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateClientProjectCategoryDto: UpdateClientProjectCategoryDto,
  ) {
    return this.clientProjectCategoryService.update(id, updateClientProjectCategoryDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a client project category' })
  @ApiResponse({ status: 200, description: 'Category deleted successfully' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.clientProjectCategoryService.remove(id);
  }
}
