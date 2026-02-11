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
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { CreateBlogCategoryDto } from './dto/create-blog-category.dto';
import { UpdateBlogCategoryDto } from './dto/update-blog-category.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('blogs')
@Controller('blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  // Blog endpoints
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new blog post' })
  @ApiResponse({
    status: 201,
    description: 'Blog created successfully',
    schema: {
      example: {
        id: 1,
        title: 'Getting Started with NestJS',
        categoryId: 1,
        category: {
          id: 1,
          title: 'Web Development',
        },
        blocks: {
          time: 1635603431943,
          blocks: [
            {
              type: 'header',
              data: { text: 'Introduction to NestJS', level: 2 },
            },
            {
              type: 'paragraph',
              data: { text: 'NestJS is a progressive Node.js framework...' },
            },
          ],
          version: '2.22.2',
        },
        tags: ['NestJS', 'TypeScript', 'Backend'],
        createdAt: '2024-02-11T10:00:00.000Z',
        updatedAt: '2024-02-11T10:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    schema: {
      example: {
        statusCode: 400,
        message: 'Validation failed',
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
    description: 'Category not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Blog category with ID 999 not found',
        error: 'Not Found',
      },
    },
  })
  createBlog(@Body() createBlogDto: CreateBlogDto) {
    return this.blogService.createBlog(createBlogDto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all blog posts' })
  @ApiResponse({
    status: 200,
    description: 'Blogs retrieved successfully',
    schema: {
      example: [
        {
          id: 1,
          title: 'Getting Started with NestJS',
          categoryId: 1,
          category: {
            id: 1,
            title: 'Web Development',
          },
          blocks: {
            time: 1635603431943,
            blocks: [
              {
                type: 'header',
                data: { text: 'Introduction to NestJS', level: 2 },
              },
            ],
            version: '2.22.2',
          },
          tags: ['NestJS', 'TypeScript', 'Backend'],
          createdAt: '2024-02-11T10:00:00.000Z',
          updatedAt: '2024-02-11T10:00:00.000Z',
        },
        {
          id: 2,
          title: 'React Best Practices',
          categoryId: 1,
          category: {
            id: 1,
            title: 'Web Development',
          },
          blocks: {
            time: 1635603431943,
            blocks: [],
            version: '2.22.2',
          },
          tags: ['React', 'JavaScript', 'Frontend'],
          createdAt: '2024-02-10T10:00:00.000Z',
          updatedAt: '2024-02-10T10:00:00.000Z',
        },
      ],
    },
  })
  findAllBlogs() {
    return this.blogService.findAllBlogs();
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get blog post by ID' })
  @ApiParam({ name: 'id', description: 'Blog ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Blog retrieved successfully',
    schema: {
      example: {
        id: 1,
        title: 'Getting Started with NestJS',
        categoryId: 1,
        category: {
          id: 1,
          title: 'Web Development',
        },
        blocks: {
          time: 1635603431943,
          blocks: [
            {
              type: 'header',
              data: { text: 'Introduction to NestJS', level: 2 },
            },
            {
              type: 'paragraph',
              data: { text: 'NestJS is a progressive Node.js framework...' },
            },
          ],
          version: '2.22.2',
        },
        tags: ['NestJS', 'TypeScript', 'Backend'],
        createdAt: '2024-02-11T10:00:00.000Z',
        updatedAt: '2024-02-11T10:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Blog not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Blog with ID 999 not found',
        error: 'Not Found',
      },
    },
  })
  findOneBlog(@Param('id', ParseIntPipe) id: number) {
    return this.blogService.findOneBlog(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update blog post' })
  @ApiParam({ name: 'id', description: 'Blog ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Blog updated successfully',
    schema: {
      example: {
        id: 1,
        title: 'Getting Started with NestJS (Updated)',
        categoryId: 1,
        category: {
          id: 1,
          title: 'Web Development',
        },
        blocks: {
          time: 1635603431943,
          blocks: [
            {
              type: 'header',
              data: { text: 'Introduction to NestJS - Updated', level: 2 },
            },
          ],
          version: '2.22.2',
        },
        tags: ['NestJS', 'TypeScript', 'Backend', 'Framework'],
        createdAt: '2024-02-11T10:00:00.000Z',
        updatedAt: '2024-02-11T11:00:00.000Z',
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
    description: 'Blog not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Blog with ID 999 not found',
        error: 'Not Found',
      },
    },
  })
  updateBlog(@Param('id', ParseIntPipe) id: number, @Body() updateBlogDto: UpdateBlogDto) {
    return this.blogService.updateBlog(id, updateBlogDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete blog post' })
  @ApiParam({ name: 'id', description: 'Blog ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Blog deleted successfully',
    schema: {
      example: {
        message: 'Blog with ID 1 has been deleted successfully',
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
    description: 'Blog not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Blog with ID 999 not found',
        error: 'Not Found',
      },
    },
  })
  removeBlog(@Param('id', ParseIntPipe) id: number) {
    return this.blogService.removeBlog(id);
  }

  // Blog Category endpoints
  @Post('categories')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new blog category' })
  @ApiResponse({
    status: 201,
    description: 'Category created successfully',
    schema: {
      example: {
        id: 1,
        title: 'Web Development',
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
  createCategory(@Body() createCategoryDto: CreateBlogCategoryDto) {
    return this.blogService.createCategory(createCategoryDto);
  }

  @Get('categories')
  @Public()
  @ApiOperation({ summary: 'Get all blog categories' })
  @ApiResponse({
    status: 200,
    description: 'Categories retrieved successfully',
    schema: {
      example: [
        {
          id: 1,
          title: 'Web Development',
          _count: {
            blogs: 5,
          },
        },
        {
          id: 2,
          title: 'Mobile Development',
          _count: {
            blogs: 3,
          },
        },
      ],
    },
  })
  findAllCategories() {
    return this.blogService.findAllCategories();
  }

  @Get('categories/:id')
  @Public()
  @ApiOperation({ summary: 'Get blog category by ID' })
  @ApiParam({ name: 'id', description: 'Category ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Category retrieved successfully',
    schema: {
      example: {
        id: 1,
        title: 'Web Development',
        blogs: [
          {
            id: 1,
            title: 'Getting Started with NestJS',
            categoryId: 1,
            blocks: {},
            tags: ['NestJS'],
            createdAt: '2024-02-11T10:00:00.000Z',
            updatedAt: '2024-02-11T10:00:00.000Z',
          },
        ],
        _count: {
          blogs: 1,
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Category not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Blog category with ID 999 not found',
        error: 'Not Found',
      },
    },
  })
  findOneCategory(@Param('id', ParseIntPipe) id: number) {
    return this.blogService.findOneCategory(id);
  }

  @Patch('categories/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update blog category' })
  @ApiParam({ name: 'id', description: 'Category ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Category updated successfully',
    schema: {
      example: {
        id: 1,
        title: 'Web Development (Updated)',
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
    description: 'Category not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Blog category with ID 999 not found',
        error: 'Not Found',
      },
    },
  })
  updateCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateBlogCategoryDto,
  ) {
    return this.blogService.updateCategory(id, updateCategoryDto);
  }

  @Delete('categories/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete blog category' })
  @ApiParam({ name: 'id', description: 'Category ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Category deleted successfully',
    schema: {
      example: {
        message: 'Blog category with ID 1 has been deleted successfully',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Category has associated blogs',
    schema: {
      example: {
        statusCode: 400,
        message: 'Cannot delete category with 5 associated blogs',
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
    description: 'Category not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Blog category with ID 999 not found',
        error: 'Not Found',
      },
    },
  })
  removeCategory(@Param('id', ParseIntPipe) id: number) {
    return this.blogService.removeCategory(id);
  }
}
