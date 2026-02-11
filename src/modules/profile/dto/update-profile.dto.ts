import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({ required: false, example: 'john@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ required: false, example: 'John Doe' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false, example: 'Full Stack Developer' })
  @IsOptional()
  @IsString()
  subtitle?: string;

  @ApiProperty({ required: false, example: 'New York, USA' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ required: false, example: 'Passionate developer with 5 years of experience' })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({ required: false, example: 'Experienced in building scalable web applications...' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false, example: 'https://example.com/resume.pdf' })
  @IsOptional()
  @IsString()
  resumeURL?: string;

  @ApiProperty({ required: false, example: 'contact@example.com' })
  @IsOptional()
  @IsEmail()
  contactEmail?: string;

  @ApiProperty({ required: false, example: '+1234567890' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ required: false, example: 'Mon-Fri: 9AM-5PM EST' })
  @IsOptional()
  @IsString()
  workingHour?: string;
}
