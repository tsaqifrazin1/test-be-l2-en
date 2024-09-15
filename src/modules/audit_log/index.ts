import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLogEntity } from './entities';
import { AuditLogRepositoryToken, AuditLogServiceToken } from './interface';
import { AuditLogRepository } from './repository';
import { AuditLogService } from './service';
import { AuditLogEventListener } from './event/audit_log.event';

@Module({
  imports: [TypeOrmModule.forFeature([AuditLogEntity])],
  providers: [
    AuditLogService,
    AuditLogRepository,
    AuditLogEventListener,
    {
      provide: AuditLogRepositoryToken,
      useClass: AuditLogRepository,
    },
    {
      provide: AuditLogServiceToken,
      useClass: AuditLogService,
    },
  ],
  exports: [
    AuditLogService,
    AuditLogRepository,
    AuditLogRepositoryToken,
    AuditLogServiceToken,
  ],
})
export class AuditLogModule {}
