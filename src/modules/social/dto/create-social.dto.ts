import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsUrl } from 'class-validator';

export class CreateSocialDto {
  @ApiProperty({
    description: 'Name of the social platform',
    example: 'GitHub',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'URL to the social profile',
    example: 'https://github.com/johndoe',
  })
  @IsString()
  @IsNotEmpty()
  url: string;
}
