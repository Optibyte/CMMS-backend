import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PermissionDto, UpdatePermissionDto } from './dto/role.dto';
import { RoleEntity } from './entities/role.entity';
import { Request as Req } from '../users/user.interface';
import { LoggerService } from 'src/logger/logger.service';
import { DatabaseNames, LogsLevelConstant } from '../constants/message-constants';
import { PermissionEntity } from './entities/permission.entity';
import { Filters } from './role.interface';

@Injectable()
export class PermissionService {

    constructor(
        private readonly loggerService: LoggerService,
        @InjectRepository(PermissionEntity, DatabaseNames.CMMS_DB)
        private permissionRepository: Repository<PermissionEntity>
    ) { }

    async createPermission(permissionDto: PermissionDto) {
        try {
            // Check if the permission already exists based on name.
            const existingPermission = await this.permissionRepository.findOne({
                where: { name: permissionDto.name }
            });

            if (existingPermission) {
                throw new HttpException(`Permission name already exists`, HttpStatus.BAD_REQUEST);
            }

            // Save the new permission in the database.
            const permission = await this.permissionRepository.save(permissionDto);
            return permission;
        } catch (error) {
            this.loggerService.loggerService({ level: LogsLevelConstant.ERROR, message: error?.message });
            throw new HttpException(error?.message, error?.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getPermission(filters: Filters) {
        try {
            const { name, description } = filters;

            const queryBuilder = this.permissionRepository.createQueryBuilder('permission');

            if (name) {
                queryBuilder.andWhere('permission.name ILIKE :name', { name: `%${name}%` });
            }
            if (description) {
                queryBuilder.andWhere('permission.description ILIKE :description', { description: `%${description}%` });
            }
            const permissions = await queryBuilder.getMany();

            return permissions;
        } catch (error) {
            this.loggerService.loggerService({ level: LogsLevelConstant.ERROR, message: error?.message });
            throw new HttpException(error?.message, error?.status);
        }
    }

    async fetchPermissionById(id: number) {
        try {
            // Check if the permission already exists based on id.
            const permission = await this.permissionRepository.findOne({ where: { id } });

            if (!permission) {
                throw new HttpException(`Permission not found`, HttpStatus.NOT_FOUND);
            }
            return permission;
        } catch (error) {
            this.loggerService.loggerService({ level: LogsLevelConstant.ERROR, message: error?.message });
            throw new HttpException(error?.message, error?.status);
        }
    }

    async updatePermission(permission: UpdatePermissionDto, id: number) {
        try {
            // Check if the permission already exists based on id.
            const checkPermission = await this.permissionRepository.findOne({ where: { id } });

            if (!checkPermission) {
                throw new HttpException(`Permission not found`, HttpStatus.NOT_FOUND);
            }

            // update the permissions based on id in the database. 
            await this.permissionRepository.update(id, permission);

        } catch (error) {
            this.loggerService.loggerService({ level: LogsLevelConstant.ERROR, message: error?.message });
            throw new HttpException(error?.message, error?.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}