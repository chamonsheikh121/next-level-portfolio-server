import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';

export class CreateServiceDto {
  @ApiProperty({
    description: 'Service title',
    example: 'Web Development',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({
    description: 'Service subtitle or tagline',
    example: 'Custom web solutions tailored to your needs',
  })
  @IsString()
  @IsOptional()
  subtitle?: string;

  @ApiPropertyOptional({
    description: 'Service bullet points or features',
    example: ['Responsive design', 'SEO optimized', 'Fast performance'],
    type: [String],
  })
  @IsArray()
  @IsOptional()
  bulletPoints?: string[];

  @ApiPropertyOptional({
    description: 'Core technology stacks used',
    example: ['React', 'Node.js', 'PostgreSQL'],
    type: [String],
  })
  @IsArray()
  @IsOptional()
  coreTechStacks?: string[];
}
