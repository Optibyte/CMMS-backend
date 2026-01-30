import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AssetEntity } from './entities/asset.entity';
import { Repository } from 'typeorm';
import { LoggerService } from 'src/logger/logger.service';
import { QrCodeService } from './qr-code.service';
import { DatabaseNames, FIELDS_CONSTANTS, LogsLevelConstant } from '../constants/message-constants';
import { AssetFilters, CreateAssetDto, UpdateAssetDto } from './dto/asset.dto';
import { Request as Req } from '../users/user.interface';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { ActionTypeEnum } from '../audit-logs/audit-logs.interface';
import { NormalizeService } from '../shared/normalize.service';

@Injectable()
export class AssetService {
    constructor(
        @InjectRepository(AssetEntity, DatabaseNames.CMMS_DB)
        private readonly assetRepository: Repository<AssetEntity>,
        public readonly loggerService: LoggerService,
        public readonly qrCodeService: QrCodeService,
        public readonly auditLogsService: AuditLogsService,
        public readonly normalizeService: NormalizeService
    ) { }

    async createAsset(createAssetDto: CreateAssetDto, request: Req) {
        try {
            const userId = request?.user?.id;

            // Generate QR code using qrCodeService
            const code = await this.qrCodeService.generateQrCode({ title: createAssetDto.title, category: createAssetDto.category , location: createAssetDto.location, localLabel: createAssetDto.localLabel});

            // Attach generated QR code and user details to createAssetDto
            createAssetDto[FIELDS_CONSTANTS.QR_CODE] = code.id;

            createAssetDto[FIELDS_CONSTANTS.CREATED_BY] = userId;
            createAssetDto[FIELDS_CONSTANTS.UPDATED_BY] = userId;

            // Get the next value for the sequence
            const nextValue = await this.assetRepository.query(`SELECT nextval('as_sequence')`);
            const woCode = `AS${nextValue[0].nextval}`;

            // Add the WO code to the task DTO
            createAssetDto[FIELDS_CONSTANTS.CODE] = woCode;

            // Save asset in the database
            const asset = await this.assetRepository.save(createAssetDto);
            this.auditLogsService.create(ActionTypeEnum.CREATE_ASSET, userId, asset);

            return {
                message: 'Asset created successfully.',
                assetId: asset.id,
            }
        } catch (error) {
            this.loggerService.loggerService({ level: LogsLevelConstant.ERROR, message: error?.message });
            throw new HttpException(error.message, error?.status);
        }
    }

    async fetchAsset(filters: AssetFilters) {
        try {
            const queryBuilder = this.assetRepository.createQueryBuilder('asset')
                .leftJoinAndSelect('asset.checklists', 'checklists')
                .leftJoinAndSelect('checklists.status', 'status')
                .leftJoinAndSelect('asset.qrCode', 'qrCode');

            queryBuilder.andWhere('asset.isDeleted = :isDeleted', { isDeleted: false });

            if (filters.code) {
                queryBuilder.andWhere('asset.code ILIKE :code', { code: `%${filters.code}%` });
            }
            // Add pagination and sorting
            queryBuilder.orderBy('asset.createdAt', 'DESC');

            // Execute the query
            const [asset, totalCount] = await queryBuilder.getManyAndCount();
            const normalizeAsset = asset.map((item) => this.normalizeService.normalizeAsset(item))
            return { totalCount, assets: normalizeAsset };
        } catch (error) {
            this.loggerService.loggerService({ level: LogsLevelConstant.ERROR, message: error?.message });
            throw new HttpException(error.message, error?.status);
        }
    }

    async deleteAsset(id: string, request: Req) {
        try {
            const actionBy = request?.user?.id;

            const existingAsset = await this.assetRepository.findOne({
                where: { id },
            });

            if (!existingAsset) {
                throw new HttpException(`Asset not found for this id: ${id}`, HttpStatus.NOT_FOUND);
            }

            await this.assetRepository.update({ id }, { isDeleted: true, deletedBy: actionBy });
            this.auditLogsService.create(ActionTypeEnum.DELETE_ASSET, actionBy, { assetid: id, isDeleted: true, deletedBy: actionBy });

            return {
                message: 'Asset deleted successfully.',
                assetId: id,
            }
        } catch (error) {
            this.loggerService.loggerService({ level: LogsLevelConstant.ERROR, message: error?.message });
            throw new HttpException(error.message, error?.status);
        }
    }

    async updateAsset(id: string, updateAssetDto: UpdateAssetDto, request: Req) {
        try {
            const actionBy = request?.user?.id;

            const existingAsset = await this.assetRepository.findOne({
                where: { id },
            });

            if (!existingAsset) {
                throw new HttpException(`Asset not found for this id: ${id}`, HttpStatus.NOT_FOUND);
            }
            updateAssetDto[FIELDS_CONSTANTS.UPDATED_BY] = actionBy;
            updateAssetDto[FIELDS_CONSTANTS.UPDATED_AT] = new Date();

            Object.assign(existingAsset, updateAssetDto);
            //save the updated values
            const asset = await this.assetRepository.save(existingAsset);

            this.auditLogsService.create(ActionTypeEnum.UPDATE_ASSET, actionBy, { assetid: id, ...updateAssetDto });

            return asset;
        } catch (error) {
            this.loggerService.loggerService({ level: LogsLevelConstant.ERROR, message: error?.message });
            throw new HttpException(error.message, error?.status);
        }
    }
}
