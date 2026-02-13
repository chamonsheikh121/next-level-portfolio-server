import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateProjectTypeDto {
  @ApiProperty({ example: 'Web Application', description: 'Project type title' })
  @IsString()
  @IsNotEmpty()
  title: string;
}
