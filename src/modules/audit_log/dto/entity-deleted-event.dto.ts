export class EntityDeletedEventDto {
  oldData: Record<string, any>;
  newData: Record<string, any>;
  performedBy: string;
  entity: string;
  entityId: number;
  operation: 'DELETE';

  constructor(oldData: Record<string, any>, performedBy: string, entity: string, entityId: number) {
    this.oldData = oldData;
    this.newData = {};
    this.performedBy = performedBy;
    this.entity = entity;
    this.entityId = entityId;
    this.operation = 'DELETE';
  }
}