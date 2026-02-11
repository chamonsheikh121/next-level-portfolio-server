import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';

export class CreateEducationDto {
  @ApiProperty({
    description: 'Title or degree name',
    example: 'Bachelor of Science in Computer Science',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Name of the educational institution',
    example: 'Massachusetts Institute of Technology',
  })
  @IsString()
  @IsNotEmpty()
  institution: string;

  @ApiPropertyOptional({
    description: 'Location of the institution',
    example: 'Cambridge, MA, USA',
  })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiPropertyOptional({
    description: 'Graduation date in ISO format',
    example: '2024-05-15T00:00:00.000Z',
  })
  @IsDateString()
  @IsOptional()
  graduationDate?: string;

  @ApiPropertyOptional({
    description: 'Additional description or achievements',
    example: 'Graduated with honors. GPA: 3.9/4.0',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Image URL for the institution logo or certificate',
    example: 'https://example.com/logo.png',
  })
  @IsString()
  @IsOptional()
  imageURL?: string;
}
