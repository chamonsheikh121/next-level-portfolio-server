import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CloudinaryService } from '../../common/cloudinary/cloudinary.service';
import { CreateSocialDto } from './dto/create-social.dto';
import { UpdateSocialDto } from './dto/update-social.dto';

@Injectable()
export class SocialService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(createSocialDto: CreateSocialDto, file?: Express.Multer.File) {
    try {
      let imageURL = createSocialDto.imageURL;

      // Upload image to Cloudinary if file is provided
      if (file) {
        const uploadResult = await this.cloudinaryService.uploadFile(file, 'portfolio/social');
        imageURL = uploadResult.secure_url;
      }

      const social = await this.prisma.client.socialAccount.create({
        data: {
          ...createSocialDto,
          imageURL,
        },
      });

      return social;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to create social account: ${error.message}`);
    }
  }

  async findAll() {
    try {
      const socials = await this.prisma.client.socialAccount.findMany({
        orderBy: {
          id: 'asc',
        },
      });

      return socials;
    } catch (error) {
      throw new InternalServerErrorException(`Failed to fetch social accounts: ${error.message}`);
    }
  }

  async findOne(id: number) {
    try {
      const social = await this.prisma.client.socialAccount.findUnique({
        where: { id },
      });

      if (!social) {
        throw new NotFoundException(`Social account with ID ${id} not found`);
      }

      return social;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to fetch social account: ${error.message}`);
    }
  }

  async update(id: number, updateSocialDto: UpdateSocialDto, file?: Express.Multer.File) {
    try {
      // Check if social account exists
      const existingSocial = await this.findOne(id);

      let imageURL = updateSocialDto.imageURL;

      // Upload new image to Cloudinary if file is provided
      if (file) {
        const uploadResult = await this.cloudinaryService.uploadFile(file, 'portfolio/social');
        imageURL = uploadResult.secure_url;

        // Delete old image from Cloudinary if it exists
        if (existingSocial.imageURL) {
          try {
            await this.cloudinaryService.deleteFile(existingSocial.imageURL);
          } catch (error) {
            console.error('Failed to delete old image:', error.message);
          }
        }
      }

      const updatedSocial = await this.prisma.client.socialAccount.update({
        where: { id },
        data: {
          ...updateSocialDto,
          imageURL,
        },
      });

      return updatedSocial;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to update social account: ${error.message}`);
    }
  }

  async remove(id: number) {
    try {
      // Check if social account exists
      const existingSocial = await this.findOne(id);

      // Delete image from Cloudinary if it exists
      if (existingSocial.imageURL) {
        try {
          await this.cloudinaryService.deleteFile(existingSocial.imageURL);
        } catch (error) {
          console.error('Failed to delete image:', error.message);
        }
      }

      await this.prisma.client.socialAccount.delete({
        where: { id },
      });

      return { message: `Social account with ID ${id} has been deleted successfully` };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to delete social account: ${error.message}`);
    }
  }
}
