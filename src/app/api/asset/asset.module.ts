import { Module } from '@nestjs/common';
import { AssetService } from './asset.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetController } from './asset.controller';
import { QrCodeService } from './qr-code.service';
import { AssetEntity } from './entities/asset.entity';
import { DatabaseNames } from '../constants/message-constants';
import { LoggerModule } from 'src/logger/logger.module';
import { QrCodeEntity } from './entities/qr-code.entity';
import { AuditLogsModule } from '../audit-logs/audit-logs.module';
import { NormalizeService } from '../shared/normalize.service';

@Module({
    imports: [
        LoggerModule,
        AuditLogsModule,
        TypeOrmModule.forFeature(
            [
                AssetEntity,
                QrCodeEntity
            ],
            DatabaseNames.CMMS_DB
        )],
    providers: [AssetService, QrCodeService, NormalizeService],
    controllers: [AssetController],
    exports: [AssetService]
})
export class AssetModule { }