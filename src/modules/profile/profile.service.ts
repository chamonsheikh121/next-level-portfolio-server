import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CloudinaryService } from '../../common/cloudinary/cloudinary.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    private prismaService: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  /**
   * Get the portfolio profile information (public)
   */
  async getProfile() {
    const profile = await this.prismaService.client.profileInformation.findFirst({
      orderBy: { id: 'desc' },
    });

    if (!profile) {
      throw new NotFoundException('Profile information not found');
    }

    return profile;
  }

  /**
   * Update profile information (any authorized user can update)
   * All fields are optional - only provided fields will be updated
   */
  async updateProfile(updateProfileDto: UpdateProfileDto, file?: Express.Multer.File) {
    // Check if any field is provided
    const providedFields = Object.keys(updateProfileDto).filter(
      (key) => updateProfileDto[key] !== undefined && updateProfileDto[key] !== null,
    );

    if (providedFields.length === 0 && !file) {
      return {
        success: false,
        message: 'Nothing to update. No fields were provided.',
      };
    }

    let imageURL: string | undefined;

    // Upload image to Cloudinary if file is provided
    if (file) {
      const uploadResult = await this.cloudinaryService.uploadFile(file, 'portfolio/profile');
      imageURL = uploadResult.secure_url;
      providedFields.push('imageURL');
    }

    // Check if profile exists
    const existingProfile = await this.prismaService.client.profileInformation.findFirst({
      orderBy: { id: 'desc' },
    });

    let updatedProfile;

    if (existingProfile) {
      // Delete old image from Cloudinary if new image is uploaded and old image exists
      if (file && existingProfile.imageURL) {
        try {
          await this.cloudinaryService.deleteFile(existingProfile.imageURL);
        } catch (error) {
          // Log error but don't fail the update
          console.error('Failed to delete old image from Cloudinary:', error);
        }
      }

      // Update existing profile
      updatedProfile = await this.prismaService.client.profileInformation.update({
        where: { id: existingProfile.id },
        data: {
          ...updateProfileDto,
          ...(imageURL && { imageURL }),
        },
      });
    } else {
      // Create new profile if none exists
      updatedProfile = await this.prismaService.client.profileInformation.create({
        data: {
          name: updateProfileDto.name || '',
          subtitle: updateProfileDto.subtitle,
          imageURL,
          location: updateProfileDto.location,
          bio: updateProfileDto.bio,
          description: updateProfileDto.description,
          resumeURL: updateProfileDto.resumeURL,
          contactEmail: updateProfileDto.contactEmail,
          phone: updateProfileDto.phone,
          workingHour: updateProfileDto.workingHour,
          status: updateProfileDto.status,
        },
      });
    }

    return {
      success: true,
      message: `Profile updated successfully. ${providedFields.length} field(s) updated: ${providedFields.join(', ')}`,
      data: updatedProfile,
    };
  }

  /**
   * Get career timeline (education + experience) sorted by date (public)
   */
  async getCareerTimeline() {
    // Fetch all education records
    const education = await this.prismaService.client.education.findMany({
      orderBy: { graduationDate: 'desc' },
    });

    // Fetch all experience records
    const experience = await this.prismaService.client.experience.findMany({
      orderBy: { startingDate: 'desc' },
    });

    // Transform education data to timeline format
    const educationTimeline = education.map((edu) => ({
      id: edu.id,
      type: 'education' as const,
      title: edu.title,
      organization: edu.institution,
      location: edu.location,
      startDate: null, // Education typically doesn't have start date
      endDate: edu.graduationDate,
      description: edu.description,
      imageURL: edu.imageURL,
      achievements: [],
      technologies: [],
    }));

    // Transform experience data to timeline format
    const experienceTimeline = experience.map((exp) => ({
      id: exp.id,
      type: 'experience' as const,
      title: exp.title,
      organization: exp.company,
      location: exp.location,
      startDate: exp.startingDate,
      endDate: exp.endingDate,
      description: exp.description,
      imageURL: exp.imageURL,
      achievements: exp.keyAchievements,
      technologies: exp.technologies,
    }));

    // Combine both arrays
    const timeline = [...educationTimeline, ...experienceTimeline];

    // Sort by most recent first (using endDate or startDate)
    timeline.sort((a, b) => {
      const dateA = a.endDate || a.startDate;
      const dateB = b.endDate || b.startDate;

      if (!dateA && !dateB) return 0;
      if (!dateA) return 1;
      if (!dateB) return -1;

      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });

    return {
      timeline,
      summary: {
        totalEducation: education.length,
        totalExperience: experience.length,
        totalItems: timeline.length,
      },
    };
  }
}
