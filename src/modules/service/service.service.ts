import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CloudinaryService } from '../../common/cloudinary/cloudinary.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServiceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(createServiceDto: CreateServiceDto, file?: Express.Multer.File) {
    try {
      let imageURL: string | undefined;

      // Upload image to Cloudinary if file is provided
      if (file) {
        const uploadResult = await this.cloudinaryService.uploadFile(file, 'portfolio/services');
        imageURL = uploadResult.secure_url;
      }

      const service = await this.prisma.client.service.create({
        data: {
          ...createServiceDto,
          imageURL,
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

  async update(id: number, updateServiceDto: UpdateServiceDto, file?: Express.Multer.File) {
    try {
      // Check if service exists
      const existingService = await this.findOne(id);

      let imageURL: string | undefined;

      // Upload new image to Cloudinary if file is provided
      if (file) {
        const uploadResult = await this.cloudinaryService.uploadFile(file, 'portfolio/services');
        imageURL = uploadResult.secure_url;

        // Delete old image from Cloudinary if it exists
        if (existingService.imageURL) {
          try {
            await this.cloudinaryService.deleteFile(existingService.imageURL);
          } catch (error) {
            console.error('Failed to delete old image:', error.message);
          }
        }
      }

      const updatedService = await this.prisma.client.service.update({
        where: { id },
        data: {
          ...updateServiceDto,
          ...(imageURL && { imageURL }),
        },
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
      const existingService = await this.findOne(id);

      // Delete image from Cloudinary if it exists
      if (existingService.imageURL) {
        try {
          await this.cloudinaryService.deleteFile(existingService.imageURL);
        } catch (error) {
          console.error('Failed to delete image:', error.message);
        }
      }

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
