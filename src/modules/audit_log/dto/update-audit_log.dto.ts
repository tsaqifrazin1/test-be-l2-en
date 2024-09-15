import { PartialType } from '@nestjs/swagger';
import { AuditLogDto } from './audit_log.dto';

export class UpdateAuditLogDto extends PartialType(AuditLogDto) {}