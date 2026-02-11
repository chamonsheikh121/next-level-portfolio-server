import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsArray, IsInt, IsObject, Min } from 'class-validator';

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

  @ApiPropertyOptional({
    description: 'Project image URL',
    example: 'https://example.com/project-image.png',
  })
  @IsString()
  @IsOptional()
  imageURL?: string;

  @ApiPropertyOptional({
    description: 'Frontend technologies used',
    example: ['React', 'TypeScript', 'Tailwind CSS'],
    type: [String],
  })
  @IsArray()
  @IsOptional()
  frontendTechs?: string[];

  @ApiPropertyOptional({
    description: 'Backend technologies used',
    example: ['Node.js', 'NestJS', 'PostgreSQL'],
    type: [String],
  })
  @IsArray()
  @IsOptional()
  backendTechs?: string[];

  @ApiPropertyOptional({
    description: 'DevOps technologies used',
    example: ['Docker', 'AWS', 'GitHub Actions'],
    type: [String],
  })
  @IsArray()
  @IsOptional()
  devopsTechs?: string[];

  @ApiPropertyOptional({
    description: 'Design tools and technologies',
    example: ['Figma', 'Adobe XD'],
    type: [String],
  })
  @IsArray()
  @IsOptional()
  designTechs?: string[];

  @ApiPropertyOptional({
    description: 'Other technologies used',
    example: ['Redis', 'Elasticsearch'],
    type: [String],
  })
  @IsArray()
  @IsOptional()
  othersTechs?: string[];

  @ApiPropertyOptional({
    description: 'Key accomplishments of the project',
    example: ['Increased sales by 40%', 'Reduced load time by 60%'],
    type: [String],
  })
  @IsArray()
  @IsOptional()
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
  @IsObject()
  @IsOptional()
  problems?: any;

  @ApiPropertyOptional({
    description: 'Solutions implemented',
    example: {
      scalability: 'Implemented load balancing',
      performance: 'Optimized database queries',
    },
  })
  @IsObject()
  @IsOptional()
  solutions?: any;

  @ApiPropertyOptional({
    description: 'Solution architecture details',
    example: { architecture: 'Microservices', database: 'PostgreSQL with Redis cache' },
  })
  @IsObject()
  @IsOptional()
  solutionArchitecture?: any;

  @ApiPropertyOptional({
    description: 'Challenges encountered',
    example: { technical: 'Complex payment integration', business: 'Tight deadlines' },
  })
  @IsObject()
  @IsOptional()
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
  @IsInt()
  @Min(1)
  @IsOptional()
  totalMemberWorked?: number;

  @ApiPropertyOptional({
    description: 'Project outcome',
    example: 'Successfully launched with 10K+ active users',
  })
  @IsString()
  @IsOptional()
  outcome?: string;
}
