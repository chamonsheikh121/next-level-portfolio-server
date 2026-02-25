import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateClientProjectCategoryDto } from './dto/create-client-project-category.dto';
import { UpdateClientProjectCategoryDto } from './dto/update-client-project-category.dto';

@Injectable()
export class ClientProjectCategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createClientProjectCategoryDto: CreateClientProjectCategoryDto) {
    try {
      const category = await this.prisma.client.clientProjectCategory.create({
        data: createClientProjectCategoryDto,
      });

      return category;
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to create client project category: ${error.message}`,
      );
    }
  }

  async findAll() {
    try {
      const categories = await this.prisma.client.clientProjectCategory.findMany({
        include: {
          _count: {
            select: { projects: true },
          },
        },
        orderBy: {
          id: 'asc',
        },
      });

      return categories;
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to fetch client project categories: ${error.message}`,
      );
    }
  }

  async findOne(id: number) {
    try {
      const category = await this.prisma.client.clientProjectCategory.findUnique({
        where: { id },
        include: {
          _count: {
            select: { projects: true },
          },
        },
      });

      if (!category) {
        throw new NotFoundException(`Client project category with ID ${id} not found`);
      }

      return category;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to fetch client project category: ${error.message}`,
      );
    }
  }

  async update(id: number, updateClientProjectCategoryDto: UpdateClientProjectCategoryDto) {
    try {
      // Check if category exists
      await this.findOne(id);

      const updatedCategory = await this.prisma.client.clientProjectCategory.update({
        where: { id },
        data: updateClientProjectCategoryDto,
        include: {
          _count: {
            select: { projects: true },
          },
        },
      });

      return updatedCategory;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to update client project category: ${error.message}`,
      );
    }
  }

  async remove(id: number) {
    try {
      // Check if category exists
      await this.findOne(id);

      await this.prisma.client.clientProjectCategory.delete({
        where: { id },
      });

      return {
        message: `Client project category with ID ${id} has been deleted successfully`,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to delete client project category: ${error.message}`,
      );
    }
  }
}
