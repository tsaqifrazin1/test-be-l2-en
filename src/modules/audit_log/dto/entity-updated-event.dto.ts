export class EntityUpdatedEventDto {
  oldData: Record<string, any>;
  newData: Record<string, any>;
  performedBy: string;
  entity: string;
  entityId: number;
  operation: 'UPDATE';

  constructor(oldData: Record<string, any>, newData: Record<string, any>, performedBy: string, entity: string, entityId: number) {
    this.oldData = oldData;
    this.newData = newData;
    this.performedBy = performedBy;
    this.entity = entity;
    this.entityId = entityId;
    this.operation = 'UPDATE';
  }
}