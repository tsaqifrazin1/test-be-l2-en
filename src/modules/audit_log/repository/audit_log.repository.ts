import { InjectRepository } from '@nestjs/typeorm';
import { IAuditLogRepository } from '../interface';
import { PaginationDto } from 'src/common/dto';
import { Repository } from 'typeorm';
import { CreateAuditLogDto, FilterAuditLogDto, UpdateAuditLogDto } from '../dto';
import { AuditLogEntity } from '../entities';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuditLogRepository implements IAuditLogRepository {
  constructor(
    @InjectRepository(AuditLogEntity)
    private readonly audit_logRepository: Repository<AuditLogEntity>,
  ) {}

  async create(dto: CreateAuditLogDto): Promise<AuditLogEntity> {
    const audit_log = this.audit_logRepository.create(dto);
    return this.audit_logRepository.save(audit_log);
  }

  async get(query: FilterAuditLogDto): Promise<PaginationDto<AuditLogEntity>> {
    const queryBuilder = this.audit_logRepository.createQueryBuilder('audit_log');

    queryBuilder.take(query.take);
    if ((query.page - 1) * query.take) {
      queryBuilder.skip((query.page - 1) * query.take);
    }
    const entities = await queryBuilder.getMany();
    const itemCount = await queryBuilder.getCount();

    const meta = {
      page: query.page,
      offset: query.take,
      itemCount,
      pageCount: Math.ceil(itemCount / query.take)
        ? Math.ceil(itemCount / query.take)
        : 0,
    };

    return {
      entities,
      meta,
    };
  }

  async getById(id: number): Promise<AuditLogEntity> {
    const queryBuilder = this.audit_logRepository.createQueryBuilder('audit_log');
    queryBuilder.where('audit_log.id = :id', { id });

    return queryBuilder.getOne();
  }
}