import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity } from './entities/role.entity';
import { DatabaseNames } from '../constants/message-constants';
import { LoggerModule } from 'src/logger/logger.module';
import { PermissionEntity } from './entities/permission.entity';
import { PermissionService } from './permission.service';

@Module({
  imports: [
    LoggerModule,
    TypeOrmModule.forFeature(
      [
        RoleEntity,
        PermissionEntity
      ], DatabaseNames.CMMS_DB
    )],
  controllers: [RoleController],
  providers: [RoleService, PermissionService]
})
export class RoleModule { }