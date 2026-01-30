import { HttpException, Injectable } from '@nestjs/common';
import * as QRCode from 'qrcode';
import { LoggerService } from 'src/logger/logger.service';
import { DatabaseNames, LogsLevelConstant } from '../constants/message-constants';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QrCodeEntity } from './entities/qr-code.entity';

@Injectable()
export class QrCodeService {

    constructor(
        public readonly loggerService: LoggerService,
        @InjectRepository(QrCodeEntity, DatabaseNames.CMMS_DB)
        private readonly qrCodeRepository: Repository<QrCodeEntity>,
    ) { }

    // Generates a QR code and returns it as a base64 string
    async generateQrCode(data: object): Promise<QrCodeEntity> {
        try {
            const stringifyData = JSON.stringify(data);
            const qrCode = await QRCode.toDataURL(stringifyData);
            this.loggerService.loggerService({ level: LogsLevelConstant.INFO, message: `QrCode generated successfully` });
            const payload = {
                code: qrCode,
                metadata: data
            }
            const saveQrCode = await this.qrCodeRepository.save(payload);
            // Returns the QR code as a data URL (base64 string);
            return saveQrCode;
        } catch (error) {
            this.loggerService.loggerService({ level: LogsLevelConstant.ERROR, message: error?.message });
            throw new HttpException(`Failed to generate QR Code: ${error.message}`, error?.status);
        }
    }
}
