import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateBlogCategoryDto {
  @ApiProperty({
    description: 'Category title',
    example: 'Web Development',
  })
  @IsString()
  @IsNotEmpty()
  title: string;
}
