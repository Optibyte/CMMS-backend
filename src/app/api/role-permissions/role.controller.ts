import { Body, Controller, Post, Request, Get, Param, Put, Query } from '@nestjs/common';
import { CreateRoleWithPermissionDto, PermissionDto, UpdatePermissionDto, UpdateRoleWithPermissionDto } from './dto/role.dto';
import { RoleService } from './role.service';
import { Request as Req } from '../users/user.interface';
import { RouteConstants } from '../constants/route-constants';
import { Filters } from './role.interface';
import { RequestParams } from '../constants/message-constants';
import { PermissionService } from './permission.service';

@Controller()
export class RoleController {
  constructor(
    private readonly roleService: RoleService,
    private readonly permissionService: PermissionService
  ) { }

  @Post(RouteConstants.API_CREATE_ROLE_PERMISSION)
  async createRoleWithPermissions(
    @Body() createRoleWithPermissionDto: CreateRoleWithPermissionDto[],
    @Request() request: Req) {
    return await this.roleService.createRoleWithPermissions(createRoleWithPermissionDto, request);
  }

  @Get(RouteConstants.API_GET_ROLE_PERMISSION)
  async fetchRoleWithPermission(
    @Query() filters: Filters
  ) {
    return await this.roleService.fetchRoleWithPermission(filters);
  }

  @Get(RouteConstants.API_GET_ROLE_PERMISSION_BY_ID)
  async fetchRoleWithPermissionById(
    @Param(RequestParams.ID) id: number
  ) {
    return await this.roleService.fetchRoleWithPermissionById(id);
  }

  @Put(RouteConstants.API_UPDATE_ROLE_PERMISSION)
  async updateRolePermission(
    @Param(RequestParams.ID) id: number,
    @Body() roleWithPermissionDto: UpdateRoleWithPermissionDto,
    @Request() request: Req) {
    return await this.roleService.updateRolePermission(roleWithPermissionDto, request, id);
  }

  @Post(RouteConstants.API_CREATE_PERMISSION)
  async createPermission(
    @Body() permissionDto: PermissionDto,
  ) {
    return await this.permissionService.createPermission(permissionDto);
  }

  @Get(RouteConstants.API_GET_PERMISSION)
  async getPermission(
    @Query() filters: Filters
  ) {
    return await this.permissionService.getPermission(filters);
  }

  @Get(RouteConstants.API_GET_PERMISSION_BY_ID)
  async fetchPermissionById(
    @Param(RequestParams.ID) id: number
  ) {
    return await this.permissionService.fetchPermissionById(id);
  }

  @Put(RouteConstants.API_UPDATE_PERMISSION_BY_ID)
  async updatePermission(
    @Param(RequestParams.ID) id: number,
    @Body() permissionDto: UpdatePermissionDto,
  ) {
    return await this.permissionService.updatePermission(permissionDto, id);
  }
}