import { PaginationDto } from 'src/common/dto';
import { CreateAuditLogDto, FilterAuditLogDto, UpdateAuditLogDto } from '../dto';
import { AuditLogEntity } from '../entities';

/**
 * @description AuditLogRepository Token
 */
export const AuditLogRepositoryToken = Symbol('AuditLogRepositoryToken');

/**
 * @description AuditLogRepository Interface
 */
export interface IAuditLogRepository {
  /**
   * @description Create AuditLog to Database
   */
  create(dto: CreateAuditLogDto): Promise<AuditLogEntity>;

  /**
   * @description Get AuditLog from Database with Pagination
   */
  get(query: FilterAuditLogDto): Promise<PaginationDto<AuditLogEntity>>;

  /**
   * @description Get AuditLog by Id from Database
   */
  getById(id: number): Promise<AuditLogEntity>;
}

/**
 * @description AuditLog Service Token
 */
export const AuditLogServiceToken = Symbol('AuditLogServiceToken');

/**
 * @description AuditLog Service Interface
 */
export interface IAuditLogService {
  /**
   * @description Create AuditLog
   */
  create(dto: CreateAuditLogDto): Promise<AuditLogEntity>;

  /**
   * @description Get AuditLog
   */
  get(query: FilterAuditLogDto): Promise<PaginationDto<AuditLogEntity>>;

  /**
   * @description Get AuditLog by Id
   */
  getById(id: number): Promise<AuditLogEntity>;
}