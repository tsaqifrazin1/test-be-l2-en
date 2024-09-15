import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  AuditLogRepositoryToken,
  IAuditLogRepository,
  IAuditLogService,
} from '../interface';
import { CreateAuditLogDto, FilterAuditLogDto, UpdateAuditLogDto } from '../dto';
import { AuditLogEntity } from '../entities';
import { PaginationDto } from 'src/common/dto';

@Injectable()
export class AuditLogService implements IAuditLogService {
  constructor(
    @Inject(AuditLogRepositoryToken)
    private readonly audit_logRepository: IAuditLogRepository,
  ) {}

  async create(dto: CreateAuditLogDto): Promise<AuditLogEntity> {
    return this.audit_logRepository.create(dto);
  }

  async get(query: FilterAuditLogDto): Promise<PaginationDto<AuditLogEntity>> {
    return this.audit_logRepository.get(query);
  }

  async getById(id: number): Promise<AuditLogEntity> {
    return this.audit_logRepository.getById(id);
  }
}