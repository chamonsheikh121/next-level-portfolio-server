import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateSkillDto {
  @ApiProperty({ required: false, example: 'Frontend Development' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false, example: 'Building modern user interfaces' })
  @IsOptional()
  @IsString()
  description?: string;
}
