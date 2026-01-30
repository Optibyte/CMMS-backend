import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request, UseGuards } from "@nestjs/common";
import { UsersService } from "./user.service";
import { CreateUserDto, ResetPasswordDto, UpdateUserDto } from "./dto/users.dto";
import { ApiBody } from "@nestjs/swagger";
import { RequestParams } from "../constants/message-constants";
import { RouteConstants } from "../constants/route-constants";
import { Request as Req, UserFilters } from '../users/user.interface';
import { PermissionGuard } from "src/auth/guards/permission.guard";
import { PermissionsEnum } from "../role-permissions/role.interface";

@Controller()
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post(RouteConstants.API_CREATE_USER)
    @UseGuards(new PermissionGuard(PermissionsEnum.CREATE_USERS))
    @ApiBody({ type: CreateUserDto })
    async create(@Body() createUserDto: CreateUserDto, @Request() request: Req) {
        return await this.usersService.create(createUserDto, request);
    }

    @Get(RouteConstants.API_FETCH_ALL_USER)
    async fetchUsers(
        @Query() userFilters: UserFilters
    ) {
        return this.usersService.findAllUsers(userFilters);
    }

    @Get(RouteConstants.API_FETCH_USER_BY_ID)
    async fetchUserById(
        @Param(RequestParams.ID) id: string
    ) {
        return this.usersService.findUserById(id);
    }

    @Put(RouteConstants.API_UPDATE_USER)
    async update(
        @Body() updateUserDto: UpdateUserDto,
        @Param(RequestParams.ID) id: string,
        @Request() request: Req
    ) {
        return this.usersService.update(updateUserDto, id, request);
    }

    @Delete(RouteConstants.API_DELETE_USER)
    async delete(
        @Param(RequestParams.ID) id: string,
        @Request() request: Req
    ) {
        return this.usersService.softDeleteUser(id, request);
    }

    @Put(RouteConstants.API_RESET_PASSWORD)
    async resetPasswordByUserId(
        @Body() resetPasswordDto: ResetPasswordDto,
        @Param(RequestParams.ID) id: string,
        @Request() request: Req
    ) {
        return this.usersService.resetPasswordByUserId(resetPasswordDto, id, request);
    }

    @Get(RouteConstants.API_FETCH_USERS_BY_SUPERVISOR_ID)
    async getUsersBySupervisorId(
        @Param(RequestParams.SUPERVISOR_ID) supervisorId: string
    ) {
        return this.usersService.getUsersBySupervisorId(supervisorId);
    }
}