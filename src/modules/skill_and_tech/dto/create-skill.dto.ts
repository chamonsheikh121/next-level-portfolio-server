import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSkillDto {
  @ApiProperty({ example: 'Frontend Development' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ required: false, example: 'Building modern user interfaces' })
  @IsOptional()
  @IsString()
  description?: string;
}
