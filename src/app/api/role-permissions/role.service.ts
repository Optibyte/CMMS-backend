import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleWithPermissionDto, PermissionDto, UpdatePermissionDto, UpdateRoleWithPermissionDto } from './dto/role.dto';
import { RoleEntity } from './entities/role.entity';
import { Request as Req } from '../users/user.interface';
import { LoggerService } from 'src/logger/logger.service';
import { DatabaseNames, FIELDS_CONSTANTS, LogsLevelConstant } from '../constants/message-constants';
import { PermissionEntity } from './entities/permission.entity';
import { Filters } from './role.interface';

@Injectable()
export class RoleService {

    constructor(
        private readonly loggerService: LoggerService,
        @InjectRepository(RoleEntity, DatabaseNames.CMMS_DB)
        private roleRepository: Repository<RoleEntity>
    ) { }

    async createRoleWithPermissions(roleWithPermissionDto: CreateRoleWithPermissionDto[], request: Req) {
        try {
            let payload = []
            for (const value of roleWithPermissionDto) {

                const existingRole = await this.roleRepository.findOne({
                    where: { name: value.name }
                });

                if (existingRole) {
                    throw new HttpException(`Role name already exists`, HttpStatus.BAD_REQUEST);
                }
                // Set the createdBy and updatedBy fields
                value[FIELDS_CONSTANTS.CREATED_BY] = request?.user?.id;
                value[FIELDS_CONSTANTS.UPDATED_BY] = request?.user?.id;
                payload.push(payload);
            }
            // save the role with permissions
            await this.roleRepository.save(roleWithPermissionDto);

        } catch (error) {
            this.loggerService.loggerService({ level: LogsLevelConstant.ERROR, message: error?.message });
            throw new HttpException(error?.message, error?.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async fetchRoleWithPermission(filters: Filters) {
        try {
            const { name, description } = filters;

            const queryBuilder = this.roleRepository.createQueryBuilder('role');
            queryBuilder
                .leftJoinAndSelect('role.permissions', 'permission');

            if (name) {
                queryBuilder.andWhere('role.name ILIKE :name', { name: `%${name}%` });
            }
            if (description) {
                queryBuilder.andWhere('role.description ILIKE :description', { description: `%${description}%` });
            }
            const rolePermission = await queryBuilder.getMany();
            return rolePermission;

        } catch (error) {
            this.loggerService.loggerService({ level: LogsLevelConstant.ERROR, message: error?.message });
            throw new HttpException(error?.message, error?.status);
        }
    }

    async fetchRoleWithPermissionById(id: number) {
        try {
            const roleWithPermission = await this.roleRepository.findOne({ where: { id } });

            if (!roleWithPermission) {
                throw new HttpException(`Role not found`, HttpStatus.NOT_FOUND);
            }
            return roleWithPermission;
        } catch (error) {
            this.loggerService.loggerService({ level: LogsLevelConstant.ERROR, message: error?.message });
            throw new HttpException(error?.message, error?.status);
        }
    }

    async updateRolePermission(roleWithPermissionDto: UpdateRoleWithPermissionDto, request: Req, id: number) {
        try {

            const roleWithPermission = await this.roleRepository.findOne({ where: { id } });

            if (!roleWithPermission) {
                throw new HttpException(`Role not found`, HttpStatus.NOT_FOUND);
            }

            roleWithPermissionDto[FIELDS_CONSTANTS.CREATED_BY] = request?.user?.id;
            roleWithPermissionDto[FIELDS_CONSTANTS.UPDATED_BY] = request?.user?.id;

            // update the role with permissions
            await this.roleRepository.update(id, roleWithPermissionDto);

        } catch (error) {
            this.loggerService.loggerService({ level: LogsLevelConstant.ERROR, message: error?.message });
            throw new HttpException(error?.message, error?.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}