import {
  ClassSerializerInterceptor,
  SetMetadata,
  Type,
  UseInterceptors,
  applyDecorators,
} from '@nestjs/common';
import { ApiArrayResponse } from '../response/array.response';
import {
  TransformationInterceptor,
  TransformationInterceptorArray,
  TransformationInterceptorPagination,
} from 'src/interceptors';
import { ApiResponseOptions } from '@nestjs/swagger';
import { ApiObjectResponse } from '../response/object.response';
import { ApiPaginationResponse } from '../response/pagination.response';

export const UseArrayInterceptors = <DataDto extends Type<unknown>>(
  options: ApiResponseOptions,
  dataDto: DataDto,
  isPrimitive?: boolean,
) =>
  applyDecorators(
    ApiArrayResponse(options, dataDto, isPrimitive),
    UseInterceptors(TransformationInterceptorArray<DataDto>),
  );

export const UseObjectInterceptors = <
  DataDto extends Type<unknown> | Type<unknown>[],
>(
  options: ApiResponseOptions,
  dataDto?: DataDto,
) =>
  applyDecorators(
    ApiObjectResponse(options, dataDto),
    UseInterceptors(TransformationInterceptor<DataDto>),
  );

export const UsePaginationInterceptors = <DataDto extends Type<unknown>>(
  options: ApiResponseOptions,
  dataDto: DataDto,
) =>
  applyDecorators(
    ApiPaginationResponse(options, dataDto),
    UseInterceptors(TransformationInterceptorPagination<DataDto>),
  );
