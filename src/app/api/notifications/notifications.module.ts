import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationEntity } from './entities/notification.entity';
import { DatabaseNames } from '../constants/message-constants';
import { NotificationController } from './notifications.controller';
import { NotificationService } from './notifications.service';
import { LoggerModule } from 'src/logger/logger.module';
import { NormalizeService } from '../shared/normalize.service';

@Module({
    imports: [
        LoggerModule,
        TypeOrmModule.forFeature(
            [
                NotificationEntity
            ],
            DatabaseNames.CMMS_DB
        )
    ],
    controllers: [NotificationController],
    providers: [NotificationService, NormalizeService],
    exports: [NotificationService]
})
export class NotificationsModule { }
