import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CloudinaryService } from '../../common/cloudinary/cloudinary.service';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';

@Injectable()
export class ExperienceService {
  constructor(
    private prismaService: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}

  /**
   * Create a new experience
   */
  async createExperience(
    createExperienceDto: CreateExperienceDto,
    image?: Express.Multer.File,
  ) {
    let imageURL: string | undefined;

    // Upload image to Cloudinary if provided
    if (image) {
      const uploadResult = await this.cloudinaryService.uploadFile(
        image,
        'portfolio/experiences',
      );
      imageURL = uploadResult.secure_url;
    }

    const experience = await this.prismaService.client.experience.create({
      data: {
        imageURL: imageURL || createExperienceDto.imageURL,
        title: createExperienceDto.title,
        company: createExperienceDto.company,
        location: createExperienceDto.location,
        startingDate: new Date(createExperienceDto.startingDate),
        endingDate: createExperienceDto.endingDate
          ? new Date(createExperienceDto.endingDate)
          : null,
        description: createExperienceDto.description,
        keyAchievements: createExperienceDto.keyAchievements || [],
        technologies: createExperienceDto.technologies || [],
      },
    });

    return {
      success: true,
      message: 'Experience created successfully',
      data: experience,
    };
  }

  /**
   * Get all experiences
   */
  async getAllExperiences() {
    const experiences = await this.prismaService.client.experience.findMany({
      orderBy: {
        startingDate: 'desc',
      },
    });

    return {
      success: true,
      count: experiences.length,
      data: experiences,
    };
  }

  /**
   * Get a single experience by ID
   */
  async getExperienceById(id: number) {
    const experience = await this.prismaService.client.experience.findUnique({
      where: { id },
    });

    if (!experience) {
      throw new NotFoundException(`Experience with ID ${id} not found`);
    }

    return {
      success: true,
      data: experience,
    };
  }

  /**
   * Update an experience
   */
  async updateExperience(
    id: number,
    updateExperienceDto: UpdateExperienceDto,
    image?: Express.Multer.File,
  ) {
    // Check if experience exists
    const experience = await this.prismaService.client.experience.findUnique({
      where: { id },
    });

    if (!experience) {
      throw new NotFoundException(`Experience with ID ${id} not found`);
    }

    const updateData: any = { ...updateExperienceDto };

    // Upload new image to Cloudinary if provided
    if (image) {
      const uploadResult = await this.cloudinaryService.uploadFile(
        image,
        'portfolio/experiences',
      );
      updateData.imageURL = uploadResult.secure_url;

      // Delete old image from Cloudinary if it exists
      if (experience.imageURL) {
        try {
          const publicId = this.cloudinaryService.extractPublicId(experience.imageURL);
          await this.cloudinaryService.deleteFile(publicId);
        } catch (error) {
          // Continue even if deletion fails
          console.error('Failed to delete old image:', error);
        }
      }
    }

    // Convert date strings to Date objects if provided
    if (updateExperienceDto.startingDate) {
      updateData.startingDate = new Date(updateExperienceDto.startingDate);
    }
    if (updateExperienceDto.endingDate) {
      updateData.endingDate = new Date(updateExperienceDto.endingDate);
    }

    const updatedExperience = await this.prismaService.client.experience.update({
      where: { id },
      data: updateData,
    });

    return {
      success: true,
      message: 'Experience updated successfully',
      data: updatedExperience,
    };
  }

  /**
   * Delete an experience
   */
  async deleteExperience(id: number) {
    // Check if experience exists
    const experience = await this.prismaService.client.experience.findUnique({
      where: { id },
    });

    if (!experience) {
      throw new NotFoundException(`Experience with ID ${id} not found`);
    }

    // Delete image from Cloudinary if it exists
    if (experience.imageURL) {
      try {
        const publicId = this.cloudinaryService.extractPublicId(experience.imageURL);
        await this.cloudinaryService.deleteFile(publicId);
      } catch (error) {
        // Continue even if deletion fails
        console.error('Failed to delete image:', error);
      }
    }

    await this.prismaService.client.experience.delete({
      where: { id },
    });

    return {
      success: true,
      message: 'Experience deleted successfully',
    };
  }
}
