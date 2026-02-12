import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateFaqCategoryDto } from './dto/create-faq-category.dto';
import { UpdateFaqCategoryDto } from './dto/update-faq-category.dto';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';

@Injectable()
export class FaqService {
  constructor(private readonly prisma: PrismaService) {}

  // FAQ Category CRUD operations
  async createCategory(createFaqCategoryDto: CreateFaqCategoryDto) {
    try {
      const category = await this.prisma.client.faqCategory.create({
        data: createFaqCategoryDto,
      });

      return category;
    } catch (error) {
      throw new InternalServerErrorException(`Failed to create FAQ category: ${error.message}`);
    }
  }

  async findAllCategories() {
    try {
      const categories = await this.prisma.client.faqCategory.findMany({
        include: {
          _count: {
            select: { faqs: true },
          },
        },
        orderBy: {
          id: 'asc',
        },
      });

      return categories;
    } catch (error) {
      throw new InternalServerErrorException(`Failed to fetch FAQ categories: ${error.message}`);
    }
  }

  async findOneCategory(id: number) {
    try {
      const category = await this.prisma.client.faqCategory.findUnique({
        where: { id },
        include: {
          faqs: true,
          _count: {
            select: { faqs: true },
          },
        },
      });

      if (!category) {
        throw new NotFoundException(`FAQ category with ID ${id} not found`);
      }

      return category;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to fetch FAQ category: ${error.message}`);
    }
  }

  async updateCategory(id: number, updateFaqCategoryDto: UpdateFaqCategoryDto) {
    try {
      // Check if category exists
      await this.findOneCategory(id);

      const updatedCategory = await this.prisma.client.faqCategory.update({
        where: { id },
        data: updateFaqCategoryDto,
      });

      return updatedCategory;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to update FAQ category: ${error.message}`);
    }
  }

  async removeCategory(id: number) {
    try {
      // Check if category exists
      const category = await this.findOneCategory(id);

      // Check if category has FAQs
      if (category._count.faqs > 0) {
        throw new BadRequestException(
          `Cannot delete FAQ category with ${category._count.faqs} associated FAQs`,
        );
      }

      await this.prisma.client.faqCategory.delete({
        where: { id },
      });

      return { message: `FAQ category with ID ${id} has been deleted successfully` };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to delete FAQ category: ${error.message}`);
    }
  }

  // FAQ CRUD operations
  async create(createFaqDto: CreateFaqDto) {
    try {
      // Check if category exists
      const category = await this.prisma.client.faqCategory.findUnique({
        where: { id: createFaqDto.categoryId },
      });

      if (!category) {
        throw new NotFoundException(`FAQ category with ID ${createFaqDto.categoryId} not found`);
      }

      const faq = await this.prisma.client.faq.create({
        data: createFaqDto,
        include: {
          category: true,
        },
      });

      return faq;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to create FAQ: ${error.message}`);
    }
  }

  async findAll() {
    try {
      const faqs = await this.prisma.client.faq.findMany({
        include: {
          category: true,
        },
        orderBy: {
          id: 'asc',
        },
      });

      return faqs;
    } catch (error) {
      throw new InternalServerErrorException(`Failed to fetch FAQs: ${error.message}`);
    }
  }

  async findOne(id: number) {
    try {
      const faq = await this.prisma.client.faq.findUnique({
        where: { id },
        include: {
          category: true,
        },
      });

      if (!faq) {
        throw new NotFoundException(`FAQ with ID ${id} not found`);
      }

      return faq;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to fetch FAQ: ${error.message}`);
    }
  }

  async update(id: number, updateFaqDto: UpdateFaqDto) {
    try {
      // Check if FAQ exists
      await this.findOne(id);

      // If categoryId is provided, check if category exists
      if (updateFaqDto.categoryId) {
        const category = await this.prisma.client.faqCategory.findUnique({
          where: { id: updateFaqDto.categoryId },
        });

        if (!category) {
          throw new NotFoundException(`FAQ category with ID ${updateFaqDto.categoryId} not found`);
        }
      }

      const updatedFaq = await this.prisma.client.faq.update({
        where: { id },
        data: updateFaqDto,
        include: {
          category: true,
        },
      });

      return updatedFaq;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to update FAQ: ${error.message}`);
    }
  }

  async remove(id: number) {
    try {
      // Check if FAQ exists
      await this.findOne(id);

      await this.prisma.client.faq.delete({
        where: { id },
      });

      return { message: `FAQ with ID ${id} has been deleted successfully` };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to delete FAQ: ${error.message}`);
    }
  }
}
