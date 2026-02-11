import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min, Max } from 'class-validator';

export class UpdateTechnologyDto {
  @ApiProperty({ required: false, example: 'React' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false, example: 85, description: 'Proficiency level (0-100)' })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  level?: number;

  @ApiProperty({ required: false, example: 1, description: 'Skill ID this technology belongs to' })
  @IsOptional()
  @IsInt()
  skillId?: number;
}
