import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsDateString, IsArray } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateExperienceDto {
  @ApiProperty({ example: 'Senior Full Stack Developer' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: 'Tech Solutions Inc.' })
  @IsNotEmpty()
  @IsString()
  company: string;

  @ApiProperty({ required: false, example: 'San Francisco, CA' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ example: '2023-01-15T00:00:00.000Z' })
  @IsNotEmpty()
  @IsDateString()
  startingDate: string;

  @ApiProperty({ required: false, example: '2024-12-31T00:00:00.000Z', description: 'Leave empty for current position' })
  @IsOptional()
  @IsDateString()
  endingDate?: string;

  @ApiProperty({ required: false, example: 'Led development of scalable applications' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ 
    required: false, 
    type: [String],
    example: ['Increased performance by 40%', 'Led team of 5 developers'],
    description: 'Send as JSON array string: ["item1", "item2"] or comma-separated: item1,item2'
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
      // Try to parse as JSON first
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [value];
      } catch {
        // If not JSON, split by comma
        return value.split(',').map(item => item.trim()).filter(Boolean);
      }
    }
    return [value];
  })
  @IsArray()
  @IsString({ each: true })
  keyAchievements?: string[];

  @ApiProperty({ 
    required: false,
    type: [String],
    example: ['React', 'Node.js', 'PostgreSQL'],
    description: 'Send as JSON array string: ["item1", "item2"] or comma-separated: item1,item2'
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
      // Try to parse as JSON first
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [value];
      } catch {
        // If not JSON, split by comma
        return value.split(',').map(item => item.trim()).filter(Boolean);
      }
    }
    return [value];
  })
  @IsArray()
  @IsString({ each: true })
  technologies?: string[];
}
