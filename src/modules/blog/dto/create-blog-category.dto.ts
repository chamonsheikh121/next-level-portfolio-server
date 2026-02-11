import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';

export class CreateBlogCategoryDto {
  @ApiProperty({
    description: 'Category title',
    example: 'Web Development',
  })
  @IsString()
  @IsNotEmpty()
  title: string;
}
