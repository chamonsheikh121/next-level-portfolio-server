import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEmail } from 'class-validator';

export class UpdateUserMessageDto {
  @ApiPropertyOptional({
    description: 'Name of the person sending the message',
    example: 'John Doe',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'Email address of the sender',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    description: 'Title or subject of the message',
    example: 'Updated inquiry about collaboration',
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({
    description: 'Message content',
    example: 'Updated message content...',
  })
  @IsString()
  @IsOptional()
  message?: string;
}
