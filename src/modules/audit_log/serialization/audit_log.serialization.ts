import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class AuditLogSerialization {
  @ApiProperty()
  id: number;

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

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @Exclude()
  deletedAt: Date;
}
