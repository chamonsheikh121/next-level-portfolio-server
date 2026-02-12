import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CloudinaryService } from '../../common/cloudinary/cloudinary.service';
import { CreateAwardDto } from './dto/create-award.dto';
import { UpdateAwardDto } from './dto/update-award.dto';

@Injectable()
export class AwardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(createAwardDto: CreateAwardDto, file?: Express.Multer.File) {
    try {
      let imageURL: string | undefined;

      // Upload image to Cloudinary if file is provided
      if (file) {
        const uploadResult = await this.cloudinaryService.uploadFile(file, 'portfolio/awards');
        imageURL = uploadResult.secure_url;
      }

      const award = await this.prisma.client.award.create({
        data: {
          ...createAwardDto,
          imageURL,
          awardDate: createAwardDto.awardDate ? new Date(createAwardDto.awardDate) : null,
        },
      });

      return award;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to create award record: ${error.message}`);
    }
  }

  async findAll() {
    try {
      const awards = await this.prisma.client.award.findMany({
        orderBy: {
          awardDate: 'desc',
        },
      });

      return awards;
    } catch (error) {
      throw new InternalServerErrorException(`Failed to fetch award records: ${error.message}`);
    }
  }

  async findOne(id: number) {
    try {
      const award = await this.prisma.client.award.findUnique({
        where: { id },
      });

      if (!award) {
        throw new NotFoundException(`Award record with ID ${id} not found`);
      }

      return award;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to fetch award record: ${error.message}`);
    }
  }

  async update(id: number, updateAwardDto: UpdateAwardDto, file?: Express.Multer.File) {
    try {
      // Check if award exists
      const existingAward = await this.findOne(id);

      let imageURL: string | undefined;

      // Upload new image to Cloudinary if file is provided
      if (file) {
        const uploadResult = await this.cloudinaryService.uploadFile(file, 'portfolio/awards');
        imageURL = uploadResult.secure_url;

        // Delete old image from Cloudinary if it exists
        if (existingAward.imageURL) {
          try {
            await this.cloudinaryService.deleteFile(existingAward.imageURL);
          } catch (error) {
            console.error('Failed to delete old image:', error.message);
          }
        }
      }

      const updatedAward = await this.prisma.client.award.update({
        where: { id },
        data: {
          ...updateAwardDto,
          imageURL,
          awardDate: updateAwardDto.awardDate ? new Date(updateAwardDto.awardDate) : undefined,
        },
      });

      return updatedAward;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to update award record: ${error.message}`);
    }
  }

  async remove(id: number) {
    try {
      // Check if award exists
      const existingAward = await this.findOne(id);

      // Delete image from Cloudinary if it exists
      if (existingAward.imageURL) {
        try {
          await this.cloudinaryService.deleteFile(existingAward.imageURL);
        } catch (error) {
          console.error('Failed to delete image:', error.message);
        }
      }

      await this.prisma.client.award.delete({
        where: { id },
      });

      return { message: `Award record with ID ${id} has been deleted successfully` };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to delete award record: ${error.message}`);
    }
  }
}
