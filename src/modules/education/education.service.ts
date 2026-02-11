import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CloudinaryService } from '../../common/cloudinary/cloudinary.service';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';

@Injectable()
export class EducationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(createEducationDto: CreateEducationDto, file?: Express.Multer.File) {
    try {
      let imageURL = createEducationDto.imageURL;

      // Upload image to Cloudinary if file is provided
      if (file) {
        const uploadResult = await this.cloudinaryService.uploadFile(file, 'portfolio/education');
        imageURL = uploadResult.secure_url;
      }

      const education = await this.prisma.client.education.create({
        data: {
          ...createEducationDto,
          imageURL,
          graduationDate: createEducationDto.graduationDate
            ? new Date(createEducationDto.graduationDate)
            : null,
        },
      });

      return education;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to create education record: ${error.message}`);
    }
  }

  async findAll() {
    try {
      const educations = await this.prisma.client.education.findMany({
        orderBy: {
          graduationDate: 'desc',
        },
      });

      return educations;
    } catch (error) {
      throw new InternalServerErrorException(`Failed to fetch education records: ${error.message}`);
    }
  }

  async findOne(id: number) {
    try {
      const education = await this.prisma.client.education.findUnique({
        where: { id },
      });

      if (!education) {
        throw new NotFoundException(`Education record with ID ${id} not found`);
      }

      return education;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to fetch education record: ${error.message}`);
    }
  }

  async update(id: number, updateEducationDto: UpdateEducationDto, file?: Express.Multer.File) {
    try {
      // Check if education exists
      const existingEducation = await this.findOne(id);

      let imageURL = updateEducationDto.imageURL;

      // Upload new image to Cloudinary if file is provided
      if (file) {
        const uploadResult = await this.cloudinaryService.uploadFile(file, 'portfolio/education');
        imageURL = uploadResult.secure_url;

        // Delete old image from Cloudinary if it exists
        if (existingEducation.imageURL) {
          try {
            await this.cloudinaryService.deleteFile(existingEducation.imageURL);
          } catch (error) {
            console.error('Failed to delete old image:', error.message);
          }
        }
      }

      const updatedEducation = await this.prisma.client.education.update({
        where: { id },
        data: {
          ...updateEducationDto,
          imageURL,
          graduationDate: updateEducationDto.graduationDate
            ? new Date(updateEducationDto.graduationDate)
            : undefined,
        },
      });

      return updatedEducation;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to update education record: ${error.message}`);
    }
  }

  async remove(id: number) {
    try {
      // Check if education exists
      const existingEducation = await this.findOne(id);

      // Delete image from Cloudinary if it exists
      if (existingEducation.imageURL) {
        try {
          await this.cloudinaryService.deleteFile(existingEducation.imageURL);
        } catch (error) {
          console.error('Failed to delete image:', error.message);
        }
      }

      await this.prisma.client.education.delete({
        where: { id },
      });

      return { message: `Education record with ID ${id} has been deleted successfully` };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to delete education record: ${error.message}`);
    }
  }
}
