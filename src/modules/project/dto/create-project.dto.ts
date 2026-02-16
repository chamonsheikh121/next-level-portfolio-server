import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsInt,
  IsObject,
  Min,
  IsBoolean,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateProjectDto {
  @ApiProperty({
    description: 'Project title',
    example: 'E-Commerce Platform',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({
    description: 'Project subtitle or tagline',
    example: 'Full-stack online shopping solution',
  })
  @IsString()
  @IsOptional()
  subtitle?: string;

  @ApiProperty({
    description: 'Project type ID',
    example: 1,
  })
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  typeId: number;

  @ApiPropertyOptional({
    description: 'Frontend technologies used',
    example: ['React', 'TypeScript', 'Tailwind CSS'],
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
        return value
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean);
      }
    }
    return [value];
  })
  @IsArray()
  frontendTechs?: string[];

  @ApiPropertyOptional({
    description: 'Backend technologies used',
    example: ['Node.js', 'NestJS', 'PostgreSQL'],
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
        return value
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean);
      }
    }
    return [value];
  })
  @IsArray()
  backendTechs?: string[];

  @ApiPropertyOptional({
    description: 'DevOps technologies used',
    example: ['Docker', 'AWS', 'GitHub Actions'],
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
        return value
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean);
      }
    }
    return [value];
  })
  @IsArray()
  devopsTechs?: string[];

  @ApiPropertyOptional({
    description: 'Mark project as featured',
    example: false,
    default: false,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value === 'true';
    }
    return value;
  })
  @IsBoolean()
  isFeatured?: boolean;

  @ApiPropertyOptional({
    description: 'Live project URL',
    example: 'https://example.com',
  })
  @IsString()
  @IsOptional()
  liveUrl?: string;

  @ApiPropertyOptional({
    description: 'GitHub repository URL',
    example: 'https://github.com/username/repo',
  })
  @IsString()
  @IsOptional()
  githubUrl?: string;

  @ApiPropertyOptional({
    description: 'Design tools and technologies',
    example: ['Figma', 'Adobe XD'],
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
        return value
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean);
      }
    }
    return [value];
  })
  @IsArray()
  designTechs?: string[];

  @ApiPropertyOptional({
    description: 'Other technologies used',
    example: ['Redis', 'Elasticsearch'],
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
        return value
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean);
      }
    }
    return [value];
  })
  @IsArray()
  othersTechs?: string[];

  @ApiPropertyOptional({
    description: 'Key accomplishments of the project',
    example: ['Increased sales by 40%', 'Reduced load time by 60%'],
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
        return value
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean);
      }
    }
    return [value];
  })
  @IsArray()
  keyAccomplishments?: string[];

  @ApiPropertyOptional({
    description: 'Project overview description',
    example: 'A comprehensive e-commerce platform with advanced features',
  })
  @IsString()
  @IsOptional()
  projectOverview?: string;

  @ApiPropertyOptional({
    description: 'Problems faced during the project',
    example: { scalability: 'High traffic handling', performance: 'Slow queries' },
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
  problems?: any;

  @ApiPropertyOptional({
    description: 'Solutions implemented',
    example: {
      scalability: 'Implemented load balancing',
      performance: 'Optimized database queries',
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
  solutions?: any;

  @ApiPropertyOptional({
    description: 'Solution architecture details',
    example: { architecture: 'Microservices', database: 'PostgreSQL with Redis cache' },
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
  solutionArchitecture?: any;

  @ApiPropertyOptional({
    description: 'Challenges encountered',
    example: { technical: 'Complex payment integration', business: 'Tight deadlines' },
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
  challenges?: any;

  @ApiPropertyOptional({
    description: 'Project timeline',
    example: '6 months',
  })
  @IsString()
  @IsOptional()
  timeline?: string;

  @ApiPropertyOptional({
    description: 'Your role in the project',
    example: 'Full-stack Developer',
  })
  @IsString()
  @IsOptional()
  role?: string;

  @ApiPropertyOptional({
    description: 'Total team members worked on project',
    example: 5,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') return parseInt(value, 10);
    return value;
  })
  @IsInt()
  @Min(1)
  totalMemberWorked?: number;

  @ApiPropertyOptional({
    description: 'Project outcome',
    example: 'Successfully launched with 10K+ active users',
  })
  @IsString()
  @IsOptional()
  outcome?: string;
}
