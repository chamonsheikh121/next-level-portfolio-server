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
  Query,
  DefaultValuePipe,
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
  ApiQuery,
} from '@nestjs/swagger';
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
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create a new blog post with optional image upload' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
          description: 'Blog featured image (optional)',
        },
        title: { type: 'string', example: 'Getting Started with NestJS' },
        description: {
          type: 'string',
          example: 'Learn how to build scalable server-side applications',
        },
        categoryId: { type: 'number', example: 1 },
        blocks: {
          type: 'string',
          example: JSON.stringify({
            time: 1635603431943,
            blocks: [
              { type: 'header', data: { text: 'Introduction to NestJS', level: 2 } },
              { type: 'paragraph', data: { text: 'NestJS is a progressive framework...' } },
            ],
            version: '2.22.2',
          }),
          description: 'Editor.js content as JSON string',
        },
        tags: {
          type: 'string',
          example: '["NestJS", "TypeScript", "Backend"]',
          description: 'Tags as JSON array string or comma-separated',
        },
      },
      required: ['title', 'categoryId', 'blocks'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Blog created successfully',
    schema: {
      example: {
        id: 1,
        imageURL:
          'https://res.cloudinary.com/demo/image/upload/v1234567890/portfolio/blogs/blog-image.png',
        title: 'Getting Started with NestJS',
        description: 'Learn how to build scalable server-side applications',
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
  createBlog(@Body() createBlogDto: CreateBlogDto, @UploadedFile() file?: Express.Multer.File) {
    return this.blogService.createBlog(createBlogDto, file);
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
          isFeatured: false,
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
          isFeatured: false,
          createdAt: '2024-02-10T10:00:00.000Z',
          updatedAt: '2024-02-10T10:00:00.000Z',
        },
      ],
    },
  })
  findAllBlogs() {
    return this.blogService.findAllBlogs();
  }

  @Get('paginated')
  @Public()
  @ApiOperation({ summary: 'Get paginated blog posts (sorted by latest)' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    example: 1,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 9,
    description: 'Items per page (default: 9)',
  })
  @ApiResponse({
    status: 200,
    description: 'Paginated blogs retrieved successfully',
    schema: {
      example: {
        data: [
          {
            id: 3,
            imageURL:
              'https://res.cloudinary.com/demo/image/upload/v1234567890/portfolio/blogs/nestjs-guide.jpg',
            title: 'Advanced NestJS Patterns',
            description:
              'Explore advanced patterns and best practices for building scalable NestJS applications',
            categoryId: 1,
            category: {
              id: 1,
              title: 'Backend Development',
            },
            blocks: {
              time: 1635603431943,
              blocks: [
                {
                  type: 'header',
                  data: { text: 'Advanced NestJS Patterns', level: 1 },
                },
                {
                  type: 'paragraph',
                  data: { text: 'In this comprehensive guide, we will explore...' },
                },
              ],
              version: '2.22.2',
            },
            tags: ['NestJS', 'TypeScript', 'Backend', 'Patterns'],
            isFeatured: false,
            createdAt: '2026-02-15T10:00:00.000Z',
            updatedAt: '2026-02-15T10:00:00.000Z',
          },
          {
            id: 2,
            imageURL:
              'https://res.cloudinary.com/demo/image/upload/v1234567890/portfolio/blogs/react-hooks.jpg',
            title: 'Mastering React Hooks',
            description: 'Deep dive into React Hooks and modern state management',
            categoryId: 2,
            category: {
              id: 2,
              title: 'Frontend Development',
            },
            blocks: {
              time: 1635603431943,
              blocks: [
                {
                  type: 'header',
                  data: { text: 'Introduction to React Hooks', level: 1 },
                },
              ],
              version: '2.22.2',
            },
            tags: ['React', 'JavaScript', 'Hooks', 'Frontend'],
            isFeatured: false,
            createdAt: '2026-02-14T10:00:00.000Z',
            updatedAt: '2026-02-14T10:00:00.000Z',
          },
          {
            id: 1,
            imageURL: null,
            title: 'Getting Started with TypeScript',
            description: 'A beginner-friendly introduction to TypeScript',
            categoryId: 1,
            category: {
              id: 1,
              title: 'Backend Development',
            },
            blocks: {
              time: 1635603431943,
              blocks: [],
              version: '2.22.2',
            },
            tags: ['TypeScript', 'JavaScript', 'Tutorial'],
            isFeatured: false,
            createdAt: '2026-02-13T10:00:00.000Z',
            updatedAt: '2026-02-13T10:00:00.000Z',
          },
        ],
        meta: {
          total: 25,
          page: 1,
          limit: 9,
          totalPages: 3,
          hasMore: true,
        },
      },
    },
  })
  findBlogsPaginated(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(9), ParseIntPipe) limit: number,
  ) {
    return this.blogService.findBlogsPaginated(page, limit);
  }

  @Get('featured')
  @Public()
  @ApiOperation({ summary: 'Get featured blog (for hero section)' })
  @ApiResponse({
    status: 200,
    description: 'Featured blog retrieved successfully',
    schema: {
      example: {
        id: 5,
        imageURL:
          'https://res.cloudinary.com/demo/image/upload/v1234567890/portfolio/blogs/featured-blog.jpg',
        title: 'Building Modern Full-Stack Applications with NestJS and React',
        description:
          'Learn how to build scalable, production-ready full-stack applications using NestJS for the backend and React for the frontend',
        categoryId: 1,
        category: {
          id: 1,
          title: 'Full-Stack Development',
        },
        blocks: {
          time: 1708171200000,
          blocks: [
            {
              type: 'header',
              data: {
                text: 'Building Modern Full-Stack Applications',
                level: 1,
              },
            },
            {
              type: 'paragraph',
              data: {
                text: 'In this comprehensive guide, we will explore how to build a modern full-stack application using NestJS and React...',
              },
            },
            {
              type: 'header',
              data: {
                text: 'Why NestJS and React?',
                level: 2,
              },
            },
            {
              type: 'list',
              data: {
                style: 'unordered',
                items: [
                  'TypeScript support out of the box',
                  'Modular architecture',
                  'Excellent developer experience',
                  'Strong ecosystem and community',
                ],
              },
            },
          ],
          version: '2.28.0',
        },
        tags: ['NestJS', 'React', 'TypeScript', 'Full-Stack', 'Tutorial'],
        isFeatured: true,
        createdAt: '2026-02-16T10:00:00.000Z',
        updatedAt: '2026-02-16T10:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'No featured blog found (returns null)',
    schema: {
      example: null,
    },
  })
  findFeaturedBlog() {
    return this.blogService.findFeaturedBlog();
  }

  // ==================== BLOG CATEGORY ENDPOINTS (Must come before :id routes) ====================
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

  // ==================== BLOG ENDPOINTS WITH :id (Must come after specific routes) ====================

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
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Update blog post with optional image upload' })
  @ApiParam({ name: 'id', description: 'Blog ID', type: Number })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: { type: 'string', format: 'binary' },
        title: { type: 'string' },
        description: { type: 'string' },
        categoryId: { type: 'number' },
        blocks: { type: 'string', description: 'Editor.js content as JSON string' },
        tags: { type: 'string', description: 'Tags as JSON array string or comma-separated' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Blog updated successfully',
    schema: {
      example: {
        id: 1,
        imageURL:
          'https://res.cloudinary.com/demo/image/upload/v1234567890/portfolio/blogs/blog-updated.png',
        title: 'Getting Started with NestJS (Updated)',
        description: 'Learn how to build scalable applications',
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
  updateBlog(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBlogDto: UpdateBlogDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.blogService.updateBlog(id, updateBlogDto, file);
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
}
