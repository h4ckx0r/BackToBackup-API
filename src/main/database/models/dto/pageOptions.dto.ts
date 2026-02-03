import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsString, Max, Min } from 'class-validator';

export enum ORDER_OPTIONS {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class PageOptionsDto {
  @ApiProperty({ type: Number, default: 1 })
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  readonly pageNumber: number;

  @ApiProperty({ type: Number, default: 10 })
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @Max(50)
  readonly pageSize: number;

  @ApiProperty({ type: 'string', default: ORDER_OPTIONS.ASC, enum: ORDER_OPTIONS })
  @IsString()
  readonly order: ORDER_OPTIONS;
}
