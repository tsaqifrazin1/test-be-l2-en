import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AuditLogDto {
  @ApiProperty()
  entity: string;

  @ApiProperty()
  entityId: number;

  @ApiProperty()
  operation: string;

  @ApiProperty()
  oldData: Record<string, any>;

  @ApiProperty()
  newData: Record<string, any>;

  @ApiProperty()
  performedBy: string;
}