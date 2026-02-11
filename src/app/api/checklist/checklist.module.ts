import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseNames } from '../constants/message-constants';
import { LoggerModule } from 'src/logger/logger.module';
import { ChecklistEntity } from '../checklist/entities/checklist.entity';
import { ChecklistService } from './checklist.service';
import { ChecklistController } from './checklist.controller';
import { AuditLogsModule } from '../audit-logs/audit-logs.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { TaskService } from '../task/task.service';
import { TaskModule } from '../task/task.module';

@Module({
    imports: [
        LoggerModule,
        AuditLogsModule,
        NotificationsModule,
        TaskModule,
        TypeOrmModule.forFeature(
            [
                ChecklistEntity
            ],
            DatabaseNames.CMMS_DB
        )],
    providers: [ChecklistService],
    controllers: [ChecklistController],
    exports: [ChecklistService]
})
export class ChecklistModule { }