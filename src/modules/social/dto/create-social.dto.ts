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
  @IsUrl()
  @IsNotEmpty()
  url: string;

  @ApiPropertyOptional({
    description: 'Image URL for the platform icon or logo',
    example: 'https://example.com/github-icon.png',
  })
  @IsString()
  @IsOptional()
  imageURL?: string;
}
