import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('profile')
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @Public()
  @ApiOperation({
    summary: 'Get portfolio profile information',
    description: 'Get the portfolio profile information (public - no authentication required)',
  })
  @ApiResponse({
    status: 200,
    description: 'Return portfolio profile information',
    schema: {
      example: {
        id: 1,
        email: 'john@example.com',
        name: 'John Doe',
        subtitle: 'Full Stack Developer',
        imageURL:
          'https://res.cloudinary.com/demo/image/upload/v1234567890/portfolio/profile/profile-image.png',
        location: 'New York, USA',
        bio: 'Passionate developer with 5 years of experience',
        description: 'Experienced in building scalable web applications...',
        resumeURL: 'https://example.com/resume.pdf',
        contactEmail: 'contact@example.com',
        phone: '+1234567890',
        workingHour: 'Mon-Fri: 9AM-5PM EST',
        status: 'AVAILABLE',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Profile not found',
    schema: {
      example: {
        success: false,
        statusCode: 404,
        timestamp: '2026-02-11T10:30:00.000Z',
        path: '/profile',
        method: 'GET',
        error: 'Not Found',
        message: 'Profile information not found',
      },
    },
  })
  getProfile() {
    return this.profileService.getProfile();
  }

  @Patch()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Update portfolio profile information with optional image upload',
    description:
      'Update the portfolio profile information. Any authorized user can update. All fields including image are optional.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
          description: 'Profile image (optional)',
        },
        name: { type: 'string', example: 'John Doe' },
        subtitle: { type: 'string', example: 'Full Stack Developer' },
        location: { type: 'string', example: 'New York, USA' },
        bio: { type: 'string', example: 'Passionate developer with 5 years of experience' },
        description: {
          type: 'string',
          example: 'Experienced in building scalable web applications...',
        },
        resumeURL: { type: 'string', example: 'https://example.com/resume.pdf' },
        contactEmail: { type: 'string', example: 'contact@example.com' },
        phone: { type: 'string', example: '+1234567890' },
        workingHour: { type: 'string', example: 'Mon-Fri: 9AM-5PM EST' },
        status: {
          type: 'string',
          enum: [
            'AVAILABLE',
            'LIMITED',
            'IN_PROGRESS',
            'FULLY_BOOKED',
            'ON_VACATION',
            'NOT_AVAILABLE',
          ],
          example: 'AVAILABLE',
          description: 'Current availability status',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Profile updated successfully or nothing to update',
    schema: {
      example: {
        success: true,
        message: 'Profile updated successfully. 3 field(s) updated: name, subtitle, imageURL',
        data: {
          id: 1,
          name: 'John Doe',
          subtitle: 'Senior Full Stack Developer',
          imageURL:
            'https://res.cloudinary.com/demo/image/upload/v1234567890/portfolio/profile/profile-image.png',
          location: 'New York, USA',
          bio: 'Passionate developer with 5 years of experience',
          description: 'Experienced in building scalable web applications...',
          resumeURL: 'https://example.com/resume.pdf',
          contactEmail: 'contact@example.com',
          phone: '+1234567890',
          workingHour: 'Mon-Fri: 9AM-5PM EST',
          status: 'AVAILABLE',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    schema: {
      example: {
        success: false,
        statusCode: 401,
        timestamp: '2026-02-11T10:30:00.000Z',
        path: '/profile',
        method: 'PATCH',
        error: 'Unauthorized',
        message: 'Unauthorized',
      },
    },
  })
  updateProfile(
    @Body() updateProfileDto: UpdateProfileDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.profileService.updateProfile(updateProfileDto, file);
  }

  @Get('career-timeline')
  @Public()
  @ApiOperation({
    summary: 'Get career timeline (education + experience)',
    description:
      'Get combined education and experience data sorted by timeline (public - no authentication required)',
  })
  @ApiResponse({
    status: 200,
    description: 'Return career timeline with education and experience',
    schema: {
      example: {
        timeline: [
          {
            id: 2,
            type: 'experience',
            title: 'Senior Full Stack Developer',
            organization: 'Tech Corp',
            location: 'New York, USA',
            startDate: '2023-01-15T00:00:00.000Z',
            endDate: null,
            description: 'Leading development team for cloud-based solutions',
            imageURL: 'https://example.com/company-logo.png',
            achievements: ['Improved system performance by 40%', 'Led team of 5 developers'],
            technologies: ['React', 'Node.js', 'AWS', 'PostgreSQL'],
          },
          {
            id: 1,
            type: 'experience',
            title: 'Full Stack Developer',
            organization: 'StartUp Inc',
            location: 'San Francisco, USA',
            startDate: '2020-06-01T00:00:00.000Z',
            endDate: '2022-12-31T00:00:00.000Z',
            description: 'Developed web applications using modern technologies',
            imageURL: 'https://example.com/startup-logo.png',
            achievements: ['Built 3 major features', 'Reduced load time by 50%'],
            technologies: ['Vue.js', 'Express', 'MongoDB'],
          },
          {
            id: 1,
            type: 'education',
            title: 'Bachelor of Science in Computer Science',
            organization: 'University of Technology',
            location: 'Boston, USA',
            startDate: null,
            endDate: '2020-05-15T00:00:00.000Z',
            description: 'Graduated with honors, GPA: 3.8/4.0',
            imageURL: 'https://example.com/university-logo.png',
            achievements: [],
            technologies: [],
          },
        ],
        summary: {
          totalEducation: 1,
          totalExperience: 2,
          totalItems: 3,
        },
      },
    },
  })
  getCareerTimeline() {
    return this.profileService.getCareerTimeline();
  }
}
