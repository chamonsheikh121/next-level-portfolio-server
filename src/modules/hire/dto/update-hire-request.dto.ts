import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEmail, IsInt, IsArray, IsUrl, ValidateIf } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateHireRequestDto {
  @ApiPropertyOptional({
    description: 'Email address',
    example: 'client@example.com',
  })
  @Transform(({ value }) => (value === '' ? undefined : value))
  @ValidateIf((o) => o.email !== undefined && o.email !== null && o.email !== '')
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    description: 'Name of the person',
    example: 'John Doe',
  })
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'Company name',
    example: 'Tech Corp',
  })
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsString()
  @IsOptional()
  companyName?: string;

  @ApiPropertyOptional({
    description: 'LinkedIn profile URL',
    example: 'https://linkedin.com/in/johndoe',
  })
  @Transform(({ value }) => (value === '' ? undefined : value))
  @ValidateIf((o) => o.linkedinUrl !== undefined && o.linkedinUrl !== null && o.linkedinUrl !== '')
  @IsUrl()
  @IsOptional()
  linkedinUrl?: string;

  @ApiPropertyOptional({
    description: 'Additional notes',
    example: 'Updated notes',
  })
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({
    description: 'Project description',
    example: 'Updated project description',
  })
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsString()
  @IsOptional()
  projectDesc?: string;

  @ApiPropertyOptional({
    description: 'Service ID',
    example: 1,
  })
  @Transform(({ value }) => {
    if (value === '' || value === null || value === undefined) return undefined;
    if (typeof value === 'number') return value;
    if (typeof value === 'string') return parseInt(value, 10);
    return value;
  })
  @IsInt()
  @IsOptional()
  serviceId?: number;

  @ApiPropertyOptional({
    description: 'Estimated budget',
    example: '$15,000 - $25,000',
  })
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsString()
  @IsOptional()
  estimateBudget?: string;

  @ApiPropertyOptional({
    description: 'Expected timeline',
    example: '3-4 months',
  })
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsString()
  @IsOptional()
  expectedTimeline?: string;

  @ApiPropertyOptional({
    description: 'Budget',
    example: '$60,000',
  })
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsString()
  @IsOptional()
  budget?: string;

  @ApiPropertyOptional({
    description: 'Timeline',
    example: '8 months',
  })
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsString()
  @IsOptional()
  timeline?: string;

  @ApiPropertyOptional({
    description: 'Additional information',
    example: 'Updated additional details',
  })
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsString()
  @IsOptional()
  additionalinfo?: string;

  @ApiPropertyOptional({
    description: 'Core features (send as JSON string for multipart/form-data)',
    example: ['User authentication', 'Payment integration'],
    type: [String],
  })
  @Transform(({ value }) => {
    if (value === '' || value === null || value === undefined) return undefined;
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
    example: ['React', 'Node.js'],
    type: [String],
  })
  @Transform(({ value }) => {
    if (value === '' || value === null || value === undefined) return undefined;
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
