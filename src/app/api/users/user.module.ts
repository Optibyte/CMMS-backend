import { Module } from '@nestjs/common';
import { UsersService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './user.controller';
import { UserEntity } from './entities/user.entity';
import { DatabaseNames } from '../constants/message-constants';
import { LoggerModule } from 'src/logger/logger.module'
import { NormalizeService } from '../shared/normalize.service';
import { AuditLogsModule } from '../audit-logs/audit-logs.module';

@Module({
    imports: [
        AuditLogsModule,
        LoggerModule,
        TypeOrmModule.forFeature(
            [
                UserEntity
            ],
            DatabaseNames.CMMS_DB
        )],
    controllers: [UsersController],
    providers: [UsersService, NormalizeService],
    exports: [UsersService]
})
export class UsersModule { }
