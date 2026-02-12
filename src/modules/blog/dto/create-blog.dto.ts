import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsInt, IsArray, IsObject } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateBlogDto {
  @ApiProperty({
    description: 'Blog title',
    example: 'Getting Started with NestJS',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({
    description: 'Blog description or excerpt',
    example: 'Learn how to build scalable server-side applications with NestJS',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Blog category ID',
    example: 1,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') return parseInt(value, 10);
    return value;
  })
  @IsInt()
  @IsNotEmpty()
  categoryId: number;

  @ApiProperty({
    description: 'Editor.js blocks content (send as JSON string for multipart/form-data)',
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
  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return {};
    if (typeof value === 'object' && !Array.isArray(value)) return value;
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return {};
      }
    }
    return {};
  })
  @IsObject()
  @IsNotEmpty()
  blocks: any;

  @ApiPropertyOptional({
    description: 'Blog tags (send as JSON array or comma-separated)',
    example: ['NestJS', 'TypeScript', 'Backend'],
    type: [String],
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [value];
      } catch {
        return value.split(',').map(item => item.trim()).filter(Boolean);
      }
    }
    return [value];
  })
  @IsArray()
  tags?: string[];
}
