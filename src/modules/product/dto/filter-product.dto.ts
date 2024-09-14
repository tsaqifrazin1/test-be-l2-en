import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Min, Validate, ValidateIf } from 'class-validator';
import { QueryParams } from 'src/common/dto/query-params.dto';

export class FilterProductDto extends QueryParams {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  priceMin?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  priceMax?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  category?: string;
}