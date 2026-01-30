import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetEntity } from 'src/app/api/asset/entities/asset.entity';
import { ChecklistEntity } from 'src/app/api/checklist/entities/checklist.entity';
import { LogbookEntity } from 'src/app/api/asset/entities/logbook.entity';
import { QrCodeEntity } from 'src/app/api/asset/entities/qr-code.entity';
import { TaskEntity } from 'src/app/api/task/entities/task.entity';
import { DatabaseNames } from 'src/app/api/constants/message-constants';
import { PermissionEntity } from 'src/app/api/role-permissions/entities/permission.entity';
import { RoleEntity } from 'src/app/api/role-permissions/entities/role.entity';
import { UserEntity } from 'src/app/api/users/entities/user.entity';
import { AuditLogEntity } from 'src/app/api/audit-logs/entities/audit-log.entity';
import { ChecklistAuditLogEntity } from 'src/app/api/audit-logs/entities/checklist-audit-log.entity';
import { WorkflowPriorityEntity } from 'src/app/api/task/entities/workflow-priority.entity';
import { WorkflowStatusEntity } from 'src/app/api/task/entities/workflow-status.entity';
import { NotificationEntity } from 'src/app/api/notifications/entities/notification.entity';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            name: DatabaseNames.CMMS_DB,
            imports: [DatabaseModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => {
                const options = configService.get(DatabaseNames.CMMS_DB);
                if (options.ssl) {
                    options.ssl = {
                        rejectUnauthorized: true
                    }
                }
                options.entities = [
                    UserEntity,
                    AssetEntity,
                    ChecklistEntity,
                    LogbookEntity,
                    TaskEntity,
                    QrCodeEntity,
                    RoleEntity,
                    PermissionEntity,
                    AuditLogEntity,
                    ChecklistAuditLogEntity,
                    WorkflowPriorityEntity,
                    WorkflowStatusEntity,
                    NotificationEntity
                ];
                return options;
            },
        })
    ],
    providers: [],
    exports: [TypeOrmModule]
})
export class DatabaseModule { }
