import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLogEntity } from './entities/audit-log.entity';
import { DatabaseNames, LogsLevelConstant } from '../constants/message-constants';
import { LoggerService } from 'src/logger/logger.service';
import { ChecklistAuditLogEntity } from './entities/checklist-audit-log.entity';
@Injectable()
export class AuditLogsService {

    constructor(
        private readonly loggerService: LoggerService,
        @InjectRepository(AuditLogEntity, DatabaseNames.CMMS_DB)
        private auditLogsReposistory: Repository<AuditLogEntity>,
        @InjectRepository(ChecklistAuditLogEntity, DatabaseNames.CMMS_DB)
        private checklistAuditLogsReposistory: Repository<ChecklistAuditLogEntity>,
    ) { }

    async create(actionType: string, actionBy: string, data: any) {
        try {
            const payload = {
                actionType,
                actionBy,
                data
            }
            const result = await this.auditLogsReposistory.save(payload);
            this.loggerService.loggerService({
                level: LogsLevelConstant.INFO,
                message: `Audit log created successfully with this info ${JSON.stringify(result)}`,
            });
            return result;
        } catch (error) {
            throw new HttpException(error?.message, error?.status)
        }
    };

    async createChecklistLog(userId: string, taskId: string, data: any) {
        try {
            const payload = {
                user: userId,
                task: taskId,
                data
            }
            const result = await this.checklistAuditLogsReposistory.save(payload);
            this.loggerService.loggerService({
                level: LogsLevelConstant.INFO,
                message: `Checklist audit log created successfully with this info ${JSON.stringify(result)}`,
            });
            return result;
        } catch (error) {
            throw new HttpException(error?.message, error?.status)
        }
    };

};
