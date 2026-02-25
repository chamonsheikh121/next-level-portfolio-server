import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsEmail,
  IsInt,
  IsEnum,
  IsDateString,
  IsNumber,
  IsUrl,
} from 'class-validator';
import { ClientProjectStatus, ClientProjectPhase } from '../../../../prisma/generated/prisma/enums';

export { ClientProjectStatus, ClientProjectPhase };

export class CreateClientProjectDto {
  @ApiProperty({
    description: 'Project name',
    example: 'Enterprise Dashboard',
  })
  @IsString()
  @IsNotEmpty()
  projectName: string;

  @ApiProperty({
    description: 'Project description',
    example: 'A comprehensive analytics dashboard for tracking business metrics and KPIs',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Client name',
    example: 'TechCorp Solutions',
  })
  @IsString()
  @IsNotEmpty()
  clientName: string;

  @ApiProperty({
    description: 'Client email address',
    example: 'john.doe@techcorp.com',
  })
  @IsEmail()
  @IsNotEmpty()
  userEmail: string;

  @ApiProperty({
    description: 'Category ID',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  categoryId: number;

  @ApiProperty({
    description: 'Project status',
    enum: ClientProjectStatus,
    example: ClientProjectStatus.IN_PROGRESS,
  })
  @IsEnum(ClientProjectStatus)
  @IsNotEmpty()
  status: ClientProjectStatus;

  @ApiProperty({
    description: 'Project phase',
    enum: ClientProjectPhase,
    example: ClientProjectPhase.FRONTEND,
  })
  @IsEnum(ClientProjectPhase)
  @IsNotEmpty()
  phase: ClientProjectPhase;

  @ApiProperty({
    description: 'Project deadline',
    example: '2024-04-30',
  })
  @IsDateString()
  @IsNotEmpty()
  deadline: string;

  @ApiProperty({
    description: 'Project budget',
    example: 45000,
  })
  @IsNumber()
  @IsNotEmpty()
  budget: number;

  @ApiProperty({
    description: 'Project details link',
    example: 'https://example.com/project-details',
    required: false,
  })
  @IsUrl()
  @IsOptional()
  projectDetailsLink?: string;
}
