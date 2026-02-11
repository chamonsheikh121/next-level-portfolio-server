import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'sheikhchamon9@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Chamonali12!@' })
  @IsString()
  @MinLength(6)
  password: string;
}
