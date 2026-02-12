import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class TrackPageViewDto {
  @ApiProperty({
    description: 'Page slug/route to track',
    example: '/projects',
  })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({
    description: 'Page title (optional)',
    example: 'Projects',
    required: false,
  })
  @IsString()
  @IsOptional()
  title?: string;
}
