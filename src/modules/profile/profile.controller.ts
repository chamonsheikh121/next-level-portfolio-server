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
  @ApiResponse({ status: 200, description: 'Return portfolio profile information' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
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
    description: 'Profile updated successfully or nothing to update' 
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  updateProfile(
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.profileService.updateProfile(updateProfileDto);
  }
}
