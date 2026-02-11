import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(private prismaService: PrismaService) {}

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
  async updateProfile(updateProfileDto: UpdateProfileDto) {
    // Check if any field is provided
    const providedFields = Object.keys(updateProfileDto).filter(
      (key) => updateProfileDto[key] !== undefined && updateProfileDto[key] !== null,
    );

    if (providedFields.length === 0) {
      return {
        success: false,
        message: 'Nothing to update. No fields were provided.',
      };
    }

    // Check if profile exists
    const existingProfile = await this.prismaService.client.profileInformation.findFirst({
      orderBy: { id: 'desc' },
    });

    let updatedProfile;

    if (existingProfile) {
      // Update existing profile
      updatedProfile = await this.prismaService.client.profileInformation.update({
        where: { id: existingProfile.id },
        data: updateProfileDto,
      });
    } else {
      // Create new profile if none exists
      updatedProfile = await this.prismaService.client.profileInformation.create({
        data: {
          name: updateProfileDto.name || '',
          subtitle: updateProfileDto.subtitle,
          location: updateProfileDto.location,
          bio: updateProfileDto.bio,
          description: updateProfileDto.description,
          resumeURL: updateProfileDto.resumeURL,
          contactEmail: updateProfileDto.contactEmail,
          phone: updateProfileDto.phone,
          workingHour: updateProfileDto.workingHour,
        },
      });
    }

    return {
      success: true,
      message: `Profile updated successfully. ${providedFields.length} field(s) updated: ${providedFields.join(', ')}`,
      data: updatedProfile,
    };
  }
}
