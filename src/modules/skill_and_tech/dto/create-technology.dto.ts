import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min, Max } from 'class-validator';

export class CreateTechnologyDto {
  @ApiProperty({ example: 'React' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ required: false, example: 85, description: 'Proficiency level (0-100)' })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  level?: number;

  @ApiProperty({ example: 1, description: 'Skill ID this technology belongs to' })
  @IsNotEmpty()
  @IsInt()
  skillId: number;
}
