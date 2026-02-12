import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateNpmTypeDto {
  @ApiProperty({
    description: 'NPM type title',
    example: 'React Components',
  })
  @IsString()
  @IsNotEmpty()
  title: string;
}
