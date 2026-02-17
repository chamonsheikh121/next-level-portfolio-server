import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, IsOptional, IsInt, IsArray, IsUrl } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateHireRequestDto {
  @ApiProperty({
    description: 'Email address (required)',
    example: 'client@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiPropertyOptional({
    description: 'Name of the person',
    example: 'John Doe',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'Company name',
    example: 'Tech Corp',
  })
  @IsString()
  @IsOptional()
  companyName?: string;

  @ApiPropertyOptional({
    description: 'LinkedIn profile URL',
    example: 'https://linkedin.com/in/johndoe',
  })
  @IsUrl()
  @IsOptional()
  linkedinUrl?: string;

  @ApiPropertyOptional({
    description: 'Additional notes',
    example: 'Looking forward to collaboration',
  })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({
    description: 'Project description',
    example: 'Build a modern e-commerce platform',
  })
  @IsString()
  @IsOptional()
  projectDesc?: string;

  @ApiPropertyOptional({
    description: 'Service ID',
    example: 1,
  })
  @Transform(({ value }) => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') return parseInt(value, 10);
    return value;
  })
  @IsInt()
  @IsOptional()
  serviceId?: number;

  @ApiPropertyOptional({
    description: 'Estimated budget',
    example: '$10,000 - $20,000',
  })
  @IsString()
  @IsOptional()
  estimateBudget?: string;

  @ApiPropertyOptional({
    description: 'Expected timeline',
    example: '2-3 months',
  })
  @IsString()
  @IsOptional()
  expectedTimeline?: string;

  @ApiPropertyOptional({
    description: 'Budget',
    example: '$50,000',
  })
  @IsString()
  @IsOptional()
  budget?: string;

  @ApiPropertyOptional({
    description: 'Timeline',
    example: '6 months',
  })
  @IsString()
  @IsOptional()
  timeline?: string;

  @ApiPropertyOptional({
    description: 'Additional information',
    example: 'Any other relevant details about the project',
  })
  @IsString()
  @IsOptional()
  additionalinfo?: string;

  @ApiPropertyOptional({
    description: 'Core features (send as JSON string for multipart/form-data)',
    example: ['User authentication', 'Payment integration', 'Admin dashboard'],
    type: [String],
  })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return value.split(',').map((item) => item.trim());
      }
    }
    return value;
  })
  @IsArray()
  @IsOptional()
  coreFeatures?: string[];

  @ApiPropertyOptional({
    description: 'Tech suggestions (send as JSON string for multipart/form-data)',
    example: ['React', 'Node.js', 'PostgreSQL'],
    type: [String],
  })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return value.split(',').map((item) => item.trim());
      }
    }
    return value;
  })
  @IsArray()
  @IsOptional()
  techSuggestion?: string[];
}
