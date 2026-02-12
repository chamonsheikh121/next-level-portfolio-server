import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateNpmTypeDto } from './dto/create-npm-type.dto';
import { UpdateNpmTypeDto } from './dto/update-npm-type.dto';
import { CreateNpmPackageDto } from './dto/create-npm-package.dto';
import { UpdateNpmPackageDto } from './dto/update-npm-package.dto';

@Injectable()
export class NpmService {
  constructor(private readonly prisma: PrismaService) {}

  // NPM Type CRUD operations
  async createType(createNpmTypeDto: CreateNpmTypeDto) {
    try {
      const npmType = await this.prisma.client.npmType.create({
        data: createNpmTypeDto,
      });

      return npmType;
    } catch (error) {
      throw new InternalServerErrorException(`Failed to create NPM type: ${error.message}`);
    }
  }

  async findAllTypes() {
    try {
      const types = await this.prisma.client.npmType.findMany({
        include: {
          _count: {
            select: { packages: true },
          },
        },
        orderBy: {
          id: 'asc',
        },
      });

      return types;
    } catch (error) {
      throw new InternalServerErrorException(`Failed to fetch NPM types: ${error.message}`);
    }
  }

  async findOneType(id: number) {
    try {
      const npmType = await this.prisma.client.npmType.findUnique({
        where: { id },
        include: {
          packages: true,
          _count: {
            select: { packages: true },
          },
        },
      });

      if (!npmType) {
        throw new NotFoundException(`NPM type with ID ${id} not found`);
      }

      return npmType;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to fetch NPM type: ${error.message}`);
    }
  }

  async updateType(id: number, updateNpmTypeDto: UpdateNpmTypeDto) {
    try {
      // Check if type exists
      await this.findOneType(id);

      const updatedType = await this.prisma.client.npmType.update({
        where: { id },
        data: updateNpmTypeDto,
      });

      return updatedType;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to update NPM type: ${error.message}`);
    }
  }

  async removeType(id: number) {
    try {
      // Check if type exists
      const npmType = await this.findOneType(id);

      // Check if type has packages
      if (npmType._count.packages > 0) {
        throw new BadRequestException(
          `Cannot delete NPM type with ${npmType._count.packages} associated packages`,
        );
      }

      await this.prisma.client.npmType.delete({
        where: { id },
      });

      return { message: `NPM type with ID ${id} has been deleted successfully` };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to delete NPM type: ${error.message}`);
    }
  }

  // NPM Package CRUD operations
  async createPackage(createNpmPackageDto: CreateNpmPackageDto) {
    try {
      // Check if type exists
      const npmType = await this.prisma.client.npmType.findUnique({
        where: { id: createNpmPackageDto.npmTypeId },
      });

      if (!npmType) {
        throw new NotFoundException(`NPM type with ID ${createNpmPackageDto.npmTypeId} not found`);
      }

      const npmPackage = await this.prisma.client.npmPackage.create({
        data: {
          ...createNpmPackageDto,
          tags: createNpmPackageDto.tags || [],
        },
        include: {
          npmType: true,
        },
      });

      return npmPackage;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to create NPM package: ${error.message}`);
    }
  }

  async findAllPackages() {
    try {
      const packages = await this.prisma.client.npmPackage.findMany({
        include: {
          npmType: true,
        },
        orderBy: {
          id: 'desc',
        },
      });

      return packages;
    } catch (error) {
      throw new InternalServerErrorException(`Failed to fetch NPM packages: ${error.message}`);
    }
  }

  async findOnePackage(id: number) {
    try {
      const npmPackage = await this.prisma.client.npmPackage.findUnique({
        where: { id },
        include: {
          npmType: true,
        },
      });

      if (!npmPackage) {
        throw new NotFoundException(`NPM package with ID ${id} not found`);
      }

      return npmPackage;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to fetch NPM package: ${error.message}`);
    }
  }

  async updatePackage(id: number, updateNpmPackageDto: UpdateNpmPackageDto) {
    try {
      // Check if package exists
      await this.findOnePackage(id);

      // If npmTypeId is provided, check if type exists
      if (updateNpmPackageDto.npmTypeId) {
        const npmType = await this.prisma.client.npmType.findUnique({
          where: { id: updateNpmPackageDto.npmTypeId },
        });

        if (!npmType) {
          throw new NotFoundException(
            `NPM type with ID ${updateNpmPackageDto.npmTypeId} not found`,
          );
        }
      }

      const updatedPackage = await this.prisma.client.npmPackage.update({
        where: { id },
        data: updateNpmPackageDto,
        include: {
          npmType: true,
        },
      });

      return updatedPackage;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to update NPM package: ${error.message}`);
    }
  }

  async removePackage(id: number) {
    try {
      // Check if package exists
      await this.findOnePackage(id);

      await this.prisma.client.npmPackage.delete({
        where: { id },
      });

      return { message: `NPM package with ID ${id} has been deleted successfully` };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to delete NPM package: ${error.message}`);
    }
  }
}
