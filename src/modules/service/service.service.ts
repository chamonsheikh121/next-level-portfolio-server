import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServiceService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createServiceDto: CreateServiceDto) {
    try {
      const service = await this.prisma.client.service.create({
        data: {
          ...createServiceDto,
          bulletPoints: createServiceDto.bulletPoints || [],
          coreTechStacks: createServiceDto.coreTechStacks || [],
        },
      });

      return service;
    } catch (error) {
      throw new InternalServerErrorException(`Failed to create service: ${error.message}`);
    }
  }

  async findAll() {
    try {
      const services = await this.prisma.client.service.findMany({
        orderBy: {
          id: 'asc',
        },
      });

      return services;
    } catch (error) {
      throw new InternalServerErrorException(`Failed to fetch services: ${error.message}`);
    }
  }

  async findOne(id: number) {
    try {
      const service = await this.prisma.client.service.findUnique({
        where: { id },
      });

      if (!service) {
        throw new NotFoundException(`Service with ID ${id} not found`);
      }

      return service;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to fetch service: ${error.message}`);
    }
  }

  async update(id: number, updateServiceDto: UpdateServiceDto) {
    try {
      // Check if service exists
      await this.findOne(id);

      const updatedService = await this.prisma.client.service.update({
        where: { id },
        data: updateServiceDto,
      });

      return updatedService;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to update service: ${error.message}`);
    }
  }

  async remove(id: number) {
    try {
      // Check if service exists
      await this.findOne(id);

      await this.prisma.client.service.delete({
        where: { id },
      });

      return { message: `Service with ID ${id} has been deleted successfully` };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to delete service: ${error.message}`);
    }
  }
}
