import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
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
    description: 'Get the portfolio profile information (public - no authentication required)'
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
        location: 'New York, USA',
        bio: 'Passionate developer with 5 years of experience',
        description: 'Experienced in building scalable web applications...',
        resumeURL: 'https://example.com/resume.pdf',
        contactEmail: 'contact@example.com',
        phone: '+1234567890',
        workingHour: 'Mon-Fri: 9AM-5PM EST'
      }
    }
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
        message: 'Profile information not found'
      }
    }
  })
  getProfile() {
    return this.profileService.getProfile();
  }

  @Patch()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ 
    summary: 'Update portfolio profile information',
    description: 'Update the portfolio profile information. Any authorized user can update. All fields are optional.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Profile updated successfully or nothing to update',
    schema: {
      example: {
        success: true,
        message: 'Profile updated successfully. 2 field(s) updated: name, subtitle',
        data: {
          id: 1,
          email: 'john@example.com',
          name: 'John Doe',
          subtitle: 'Senior Full Stack Developer',
          location: 'New York, USA',
          bio: 'Passionate developer with 5 years of experience',
          description: 'Experienced in building scalable web applications...',
          resumeURL: 'https://example.com/resume.pdf',
          contactEmail: 'contact@example.com',
          phone: '+1234567890',
          workingHour: 'Mon-Fri: 9AM-5PM EST'
        }
      }
    }
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
        message: 'Unauthorized'
      }
    }
  })
  updateProfile(
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.profileService.updateProfile(updateProfileDto);
  }
}
