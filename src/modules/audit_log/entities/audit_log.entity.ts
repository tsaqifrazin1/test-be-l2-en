import { AbstractEntity } from 'src/common/abstract';
import { Column, Entity } from 'typeorm';

@Entity('audit_logs')
export class AuditLogEntity extends AbstractEntity {
  @Column()
  entity: string; 

  @Column()
  entityId: number;

  @Column()
  operation: string;

  @Column('jsonb')
  oldData: Record<string, any>;

  @Column('jsonb', { nullable: true })
  newData: Record<string, any>;

  @Column()
  performedBy: string;

}