import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { LoggerModule } from 'src/logger/logger.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskEntity } from './entities/task.entity';
import { DatabaseNames } from '../constants/message-constants';
import { AuditLogsModule } from '../audit-logs/audit-logs.module';
import { NormalizeService } from '../shared/normalize.service';
import { NotificationsModule } from '../notifications/notifications.module';
import { UsersModule } from '../users/user.module';
import { ChecklistEntity } from '../checklist/entities/checklist.entity';

@Module({
    imports: [
        LoggerModule,
        AuditLogsModule,
        NotificationsModule,
        UsersModule,
        TypeOrmModule.forFeature(
            [
                TaskEntity,
                ChecklistEntity
            ],
            DatabaseNames.CMMS_DB
        )
    ],
    controllers: [TaskController],
    providers: [TaskService, NormalizeService],
    exports: [TaskService]
})
export class TaskModule { }
