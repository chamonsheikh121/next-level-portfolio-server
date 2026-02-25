import { IsOptional, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export enum DateRange {
  SEVEN_DAYS = '7d',
  TEN_DAYS = '10d',
  THIRTY_DAYS = '30d',
  ONE_YEAR = '1y',
}

export class DashboardQueryDto {
  @ApiPropertyOptional({
    enum: DateRange,
    description: 'Date range filter for analytics data',
    example: '7d',
    default: '7d',
  })
  @IsOptional()
  @IsEnum(DateRange)
  dateRange?: DateRange = DateRange.SEVEN_DAYS;
}
