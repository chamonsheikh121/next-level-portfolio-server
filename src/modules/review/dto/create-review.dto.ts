import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsInt, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateReviewDto {
  @ApiProperty({
    description: 'Review rating (1-5)',
    example: 5,
    minimum: 1,
    maximum: 5,
  })
  @Transform(({ value }) => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') return parseInt(value, 10);
    return value;
  })
  @IsInt()
  @Min(1)
  @Max(5)
  @IsNotEmpty()
  rate: number;

  @ApiPropertyOptional({
    description: 'Review comment or testimonial',
    example: 'Excellent work! Very professional and delivered on time.',
  })
  @IsString()
  @IsOptional()
  comment?: string;

  @ApiProperty({
    description: 'Reviewer name',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    description: 'Reviewer subtitle (position, company, etc.)',
    example: 'CEO at Tech Company',
  })
  @IsString()
  @IsOptional()
  subtitle?: string;
}
