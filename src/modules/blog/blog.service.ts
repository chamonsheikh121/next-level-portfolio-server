import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CloudinaryService } from '../../common/cloudinary/cloudinary.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { CreateBlogCategoryDto } from './dto/create-blog-category.dto';
import { UpdateBlogCategoryDto } from './dto/update-blog-category.dto';

@Injectable()
export class BlogService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  // Blog CRUD operations
  async createBlog(createBlogDto: CreateBlogDto, file?: Express.Multer.File) {
    try {
      let imageURL: string | undefined;

      // Upload image to Cloudinary if file is provided
      if (file) {
        const uploadResult = await this.cloudinaryService.uploadFile(file, 'portfolio/blogs');
        imageURL = uploadResult.secure_url;
      }

      // Check if category exists
      const category = await this.prisma.client.blogCategory.findUnique({
        where: { id: createBlogDto.categoryId },
      });

      if (!category) {
        throw new NotFoundException(`Blog category with ID ${createBlogDto.categoryId} not found`);
      }

      const blog = await this.prisma.client.blog.create({
        data: {
          ...createBlogDto,
          imageURL,
          tags: createBlogDto.tags || [],
        },
        include: {
          category: true,
        },
      });

      return blog;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to create blog: ${error.message}`);
    }
  }

  async findAllBlogs() {
    try {
      const blogs = await this.prisma.client.blog.findMany({
        include: {
          category: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return blogs;
    } catch (error) {
      throw new InternalServerErrorException(`Failed to fetch blogs: ${error.message}`);
    }
  }

  async findOneBlog(id: number) {
    try {
      const blog = await this.prisma.client.blog.findUnique({
        where: { id },
        include: {
          category: true,
        },
      });

      if (!blog) {
        throw new NotFoundException(`Blog with ID ${id} not found`);
      }

      return blog;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to fetch blog: ${error.message}`);
    }
  }

  async updateBlog(id: number, updateBlogDto: UpdateBlogDto, file?: Express.Multer.File) {
    try {
      // Check if blog exists
      const existingBlog = await this.findOneBlog(id);

      let imageURL: string | undefined;

      // Upload new image to Cloudinary if file is provided
      if (file) {
        const uploadResult = await this.cloudinaryService.uploadFile(file, 'portfolio/blogs');
        imageURL = uploadResult.secure_url;

        // Delete old image from Cloudinary if it exists
        if (existingBlog.imageURL) {
          try {
            await this.cloudinaryService.deleteFile(existingBlog.imageURL);
          } catch (error) {
            console.error('Failed to delete old image:', error.message);
          }
        }
      }

      // If categoryId is provided, check if category exists
      if (updateBlogDto.categoryId) {
        const category = await this.prisma.client.blogCategory.findUnique({
          where: { id: updateBlogDto.categoryId },
        });

        if (!category) {
          throw new NotFoundException(
            `Blog category with ID ${updateBlogDto.categoryId} not found`,
          );
        }
      }

      const updatedBlog = await this.prisma.client.blog.update({
        where: { id },
        data: {
          ...updateBlogDto,
          imageURL,
        },
        include: {
          category: true,
        },
      });

      return updatedBlog;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to update blog: ${error.message}`);
    }
  }

  async removeBlog(id: number) {
    try {
      // Check if blog exists
      const existingBlog = await this.findOneBlog(id);

      // Delete image from Cloudinary if it exists
      if (existingBlog.imageURL) {
        try {
          await this.cloudinaryService.deleteFile(existingBlog.imageURL);
        } catch (error) {
          console.error('Failed to delete image:', error.message);
        }
      }

      await this.prisma.client.blog.delete({
        where: { id },
      });

      return { message: `Blog with ID ${id} has been deleted successfully` };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to delete blog: ${error.message}`);
    }
  }

  // Blog Category CRUD operations
  async createCategory(createCategoryDto: CreateBlogCategoryDto) {
    try {
      const category = await this.prisma.client.blogCategory.create({
        data: createCategoryDto,
      });

      return category;
    } catch (error) {
      throw new InternalServerErrorException(`Failed to create category: ${error.message}`);
    }
  }

  async findAllCategories() {
    try {
      const categories = await this.prisma.client.blogCategory.findMany({
        include: {
          _count: {
            select: { blogs: true },
          },
        },
        orderBy: {
          id: 'asc',
        },
      });

      return categories;
    } catch (error) {
      throw new InternalServerErrorException(`Failed to fetch categories: ${error.message}`);
    }
  }

  async findOneCategory(id: number) {
    try {
      const category = await this.prisma.client.blogCategory.findUnique({
        where: { id },
        include: {
          blogs: true,
          _count: {
            select: { blogs: true },
          },
        },
      });

      if (!category) {
        throw new NotFoundException(`Blog category with ID ${id} not found`);
      }

      return category;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to fetch category: ${error.message}`);
    }
  }

  async updateCategory(id: number, updateCategoryDto: UpdateBlogCategoryDto) {
    try {
      // Check if category exists
      await this.findOneCategory(id);

      const updatedCategory = await this.prisma.client.blogCategory.update({
        where: { id },
        data: updateCategoryDto,
      });

      return updatedCategory;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to update category: ${error.message}`);
    }
  }

  async removeCategory(id: number) {
    try {
      // Check if category exists
      const category = await this.findOneCategory(id);

      // Check if category has blogs
      if (category._count.blogs > 0) {
        throw new BadRequestException(
          `Cannot delete category with ${category._count.blogs} associated blogs`,
        );
      }

      await this.prisma.client.blogCategory.delete({
        where: { id },
      });

      return { message: `Blog category with ID ${id} has been deleted successfully` };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to delete category: ${error.message}`);
    }
  }
}
