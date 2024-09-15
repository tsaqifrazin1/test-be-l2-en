import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { QueryParams } from 'src/common/dto/query-params.dto';

export class FilterOrderDto extends QueryParams {}
