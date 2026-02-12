import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsInt, IsArray } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateNpmPackageDto {
  @ApiProperty({
    description: 'NPM package title',
    example: 'React Data Table Component',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'NPM type ID',
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
  npmTypeId: number;

  @ApiProperty({
    description: 'Package version',
    example: '1.0.0',
  })
  @IsString()
  @IsNotEmpty()
  version: string;

  @ApiPropertyOptional({
    description: 'Package description',
    example: 'A powerful and flexible data table component for React applications',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Live demo URL',
    example: 'https://example.com/demo',
  })
  @IsString()
  @IsOptional()
  liveURL?: string;

  @ApiPropertyOptional({
    description: 'GitHub repository URL',
    example: 'https://github.com/username/package-name',
  })
  @IsString()
  @IsOptional()
  githubUrl?: string;

  @ApiPropertyOptional({
    description: 'NPM install command',
    example: 'npm install react-data-table',
  })
  @IsString()
  @IsOptional()
  installable?: string;

  @ApiPropertyOptional({
    description: 'Package tags (send as JSON array or comma-separated)',
    example: ['react', 'table', 'component'],
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
