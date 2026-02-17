import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class CreateUserMessageDto {
  @ApiProperty({
    description: 'Name of the person sending the message',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Email address of the sender',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Title or subject of the message',
    example: 'Inquiry about collaboration',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Message content',
    example: 'I would love to discuss potential collaboration opportunities...',
  })
  @IsString()
  @IsNotEmpty()
  message: string;
}
