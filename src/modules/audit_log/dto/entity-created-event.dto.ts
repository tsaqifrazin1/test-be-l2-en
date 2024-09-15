export class EntityCreatedEventDto {
  oldData: Record<string, any>;
  newData: Record<string, any>;
  performedBy: string;
  entity: string;
  entityId: number;
  operation: 'CREATE';

  constructor(newData: Record<string, any>, performedBy: string, entity: string, entityId: number) {
    this.oldData = {};
    this.newData = newData;
    this.performedBy = performedBy;
    this.entity = entity;
    this.entityId = entityId;
    this.operation = 'CREATE';
  }
}