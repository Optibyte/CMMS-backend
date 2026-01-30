import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLogEntity } from './entities/audit-log.entity';
import { DatabaseNames } from '../constants/message-constants';
import { AuditLogsService } from './audit-logs.service';
import { LoggerModule } from 'src/logger/logger.module';
import { ChecklistAuditLogEntity } from './entities/checklist-audit-log.entity';

@Module({
    imports: [
        LoggerModule,
        TypeOrmModule.forFeature(
            [
                AuditLogEntity,
                ChecklistAuditLogEntity
            ],
            DatabaseNames.CMMS_DB
        )],
    controllers: [],
    providers: [AuditLogsService],
    exports: [AuditLogsService]
})
export class AuditLogsModule { }
