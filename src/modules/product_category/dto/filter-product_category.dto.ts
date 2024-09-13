import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { QueryParams } from 'src/common/dto/query-params.dto';

export class FilterProductCategoryDto extends QueryParams {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name: string;
}