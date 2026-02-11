import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsInt, IsArray, IsObject } from 'class-validator';

export class CreateBlogDto {
  @ApiProperty({
    description: 'Blog title',
    example: 'Getting Started with NestJS',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Blog category ID',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  categoryId: number;

  @ApiProperty({
    description: 'Editor.js blocks content',
    example: {
      time: 1635603431943,
      blocks: [
        {
          type: 'header',
          data: {
            text: 'Introduction to NestJS',
            level: 2,
          },
        },
        {
          type: 'paragraph',
          data: {
            text: 'NestJS is a progressive Node.js framework...',
          },
        },
      ],
      version: '2.22.2',
    },
  })
  @IsObject()
  @IsNotEmpty()
  blocks: any;

  @ApiPropertyOptional({
    description: 'Blog tags',
    example: ['NestJS', 'TypeScript', 'Backend'],
    type: [String],
  })
  @IsArray()
  @IsOptional()
  tags?: string[];
}
