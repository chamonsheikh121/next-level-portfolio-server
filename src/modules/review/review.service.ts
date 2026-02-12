import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CloudinaryService } from '../../common/cloudinary/cloudinary.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(createReviewDto: CreateReviewDto, file?: Express.Multer.File) {
    try {
      let avatar: string | undefined;

      // Upload avatar to Cloudinary if file is provided
      if (file) {
        const uploadResult = await this.cloudinaryService.uploadFile(file, 'portfolio/reviews');
        avatar = uploadResult.secure_url;
      }

      const review = await this.prisma.client.review.create({
        data: {
          ...createReviewDto,
          avatar,
        },
      });

      return review;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to create review: ${error.message}`);
    }
  }

  async findAll() {
    try {
      const reviews = await this.prisma.client.review.findMany({
        orderBy: {
          id: 'desc',
        },
      });

      return reviews;
    } catch (error) {
      throw new InternalServerErrorException(`Failed to fetch reviews: ${error.message}`);
    }
  }

  async findOne(id: number) {
    try {
      const review = await this.prisma.client.review.findUnique({
        where: { id },
      });

      if (!review) {
        throw new NotFoundException(`Review with ID ${id} not found`);
      }

      return review;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to fetch review: ${error.message}`);
    }
  }

  async update(id: number, updateReviewDto: UpdateReviewDto, file?: Express.Multer.File) {
    try {
      // Check if review exists
      const existingReview = await this.findOne(id);

      let avatar: string | undefined;

      // Upload new avatar to Cloudinary if file is provided
      if (file) {
        const uploadResult = await this.cloudinaryService.uploadFile(file, 'portfolio/reviews');
        avatar = uploadResult.secure_url;

        // Delete old avatar from Cloudinary if it exists
        if (existingReview.avatar) {
          try {
            await this.cloudinaryService.deleteFile(existingReview.avatar);
          } catch (error) {
            console.error('Failed to delete old avatar:', error.message);
          }
        }
      }

      const updatedReview = await this.prisma.client.review.update({
        where: { id },
        data: {
          ...updateReviewDto,
          avatar,
        },
      });

      return updatedReview;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to update review: ${error.message}`);
    }
  }

  async remove(id: number) {
    try {
      // Check if review exists
      const existingReview = await this.findOne(id);

      // Delete avatar from Cloudinary if it exists
      if (existingReview.avatar) {
        try {
          await this.cloudinaryService.deleteFile(existingReview.avatar);
        } catch (error) {
          console.error('Failed to delete avatar:', error.message);
        }
      }

      await this.prisma.client.review.delete({
        where: { id },
      });

      return { message: `Review with ID ${id} has been deleted successfully` };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to delete review: ${error.message}`);
    }
  }
}
