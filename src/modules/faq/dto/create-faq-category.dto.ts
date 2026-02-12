import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateFaqCategoryDto {
  @ApiProperty({
    description: 'FAQ category title',
    example: 'General Questions',
  })
  @IsString()
  @IsNotEmpty()
  title: string;
}
