import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

export enum MessageStatus {
  unread = 'unread',
  read = 'read',
  archived = 'archived',
}

export class UpdateStatusDto {
  @ApiProperty({
    description: 'Message status',
    example: 'read',
    enum: MessageStatus,
  })
  @IsEnum(MessageStatus)
  @IsNotEmpty()
  status: MessageStatus;
}
