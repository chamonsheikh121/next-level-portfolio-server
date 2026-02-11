import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';

export class CreateAwardDto {
  @ApiProperty({
    description: 'Title of the award',
    example: 'Best Developer Award 2024',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({
    description: 'Subtitle or category of the award',
    example: 'Excellence in Software Development',
  })
  @IsString()
  @IsOptional()
  subtitle?: string;

  @ApiPropertyOptional({
    description: 'Organization or institution that gave the award',
    example: 'Tech Excellence Foundation',
  })
  @IsString()
  @IsOptional()
  awardFrom?: string;

  @ApiPropertyOptional({
    description: 'Date when the award was received in ISO format',
    example: '2024-12-10T00:00:00.000Z',
  })
  @IsDateString()
  @IsOptional()
  awardDate?: string;

  @ApiPropertyOptional({
    description: 'Additional description about the award',
    example: 'Recognized for outstanding contributions to open-source projects',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Image URL for the award certificate or trophy',
    example: 'https://example.com/award-certificate.png',
  })
  @IsString()
  @IsOptional()
  imageURL?: string;
}
