import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

export enum HireRequestStatus {
  unread = 'unread',
  read = 'read',
  archived = 'archived',
}

export class UpdateHireStatusDto {
  @ApiProperty({
    description: 'Hire request status',
    example: 'read',
    enum: HireRequestStatus,
  })
  @IsEnum(HireRequestStatus)
  @IsNotEmpty()
  status: HireRequestStatus;
}
