import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsInt } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateFaqDto {
  @ApiProperty({
    description: 'FAQ question',
    example: 'What services do you offer?',
  })
  @IsString()
  @IsNotEmpty()
  question: string;

  @ApiProperty({
    description: 'FAQ answer',
    example: 'I offer full-stack web development, mobile app development, and UI/UX design services.',
  })
  @IsString()
  @IsNotEmpty()
  answer: string;

  @ApiProperty({
    description: 'FAQ category ID',
    example: 1,
  })
  @Transform(({ value }) => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') return parseInt(value, 10);
    return value;
  })
  @IsInt()
  @IsNotEmpty()
  categoryId: number;
}
