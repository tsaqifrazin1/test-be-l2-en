import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { EntityCreatedEventDto } from '../dto/entity-created-event.dto';
import { AuditLogService } from "../service";
import { EntityUpdatedEventDto } from "../dto";

@Injectable()
export class AuditLogEventListener {
  constructor(
    private readonly auditLogService: AuditLogService,
  ) {}

  @OnEvent('*.created', { async: true })
  async handleProductCreatedEvent(payload: EntityCreatedEventDto) {
    await this.auditLogService.create({
      entityId: payload.entityId,
      entity: payload.entity,
      operation: payload.operation,
      performedBy: payload.performedBy,
      newData: payload.newData,
      oldData: payload.oldData,
    });
  }

  @OnEvent('*.updated', { async: true })
  async handleProductUpdatedEvent(payload: EntityUpdatedEventDto) {
    await this.auditLogService.create({
      entity: payload.entity,
      entityId: payload.entityId,
      operation: payload.operation,
      performedBy: payload.performedBy,
      newData: payload.newData,
      oldData: payload.oldData,
    });
  }

  @OnEvent('*.deleted', { async: true })
  async handleProductDeletedEvent(payload: EntityUpdatedEventDto) {
    await this.auditLogService.create({
      entity: payload.entity,
      entityId: payload.entityId,
      operation: payload.operation,
      performedBy: payload.performedBy,
      newData: payload.newData,
      oldData: payload.oldData,
    });
  }
}