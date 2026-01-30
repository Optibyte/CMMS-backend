import { Controller, Get, Post, Body, Patch, Param, Delete, Request, Put, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApproveTaskDto, CreateTaskDto, TaskSummaryFilters } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { RouteConstants } from '../constants/route-constants';
import { TaskService } from './task.service';
import { Request as Req } from '../users/user.interface';
import { RequestParams } from '../constants/message-constants';
import { TaskFilters } from './task.interface';
import { PermissionsEnum } from '../role-permissions/role.interface';
import { PermissionGuard } from 'src/auth/guards/permission.guard';

@Controller()
export class TaskController {
    constructor(private readonly taskService: TaskService) { }

    @Post(RouteConstants.API_CREATE_TASK)
    @UseGuards(new PermissionGuard(PermissionsEnum.CREATE_TASK))
    async create(
        @Body() createTaskDto: CreateTaskDto,
        @Request() request: Req
    ) {
        return await this.taskService.create(createTaskDto, request);
    }

    @Put(RouteConstants.API_UPDATE_TASK)
    @HttpCode(HttpStatus.NO_CONTENT)
    async update(
        @Param(RequestParams.ID) id: string,
        @Body() updateTaskDto: UpdateTaskDto,
        @Request() request: Req
    ) {
        return await this.taskService.update(id, updateTaskDto, request);
    }

    @Get(RouteConstants.API_FETCH_TASK)
    async findAll(
        @Query() taskFilters: TaskFilters,
        @Request() request: Req
    ) {
        return await this.taskService.findAll(taskFilters, request);
    }

    @Get(RouteConstants.API_FETCH_TASK_BY_ID)
    async findOne(
        @Param(RequestParams.ID) id: string
    ) {
        return await this.taskService.findOne(id);
    }

    @Put(RouteConstants.API_APPROVE_TASK)
    @UseGuards(new PermissionGuard(PermissionsEnum.APPROVE_TASKS))
    async approveTask(
        @Param(RequestParams.ID) id: string,
        @Body() approveTaskDto: ApproveTaskDto,
        @Request() request: Req
    ): Promise<any> {
        return this.taskService.approveTask(id, approveTaskDto, request);
    }

    @Put(RouteConstants.API_TASK_ASSIGNED_TO)
    async assingedToTask(
        @Param(RequestParams.ID) id: string,
        @Param(RequestParams.ASSIGNED_TO) assignedToId: string,
        @Request() request: Req
    ): Promise<any> {
        return this.taskService.assingedToTask(id, assignedToId, request);
    }

    @Get(RouteConstants.API_FETCH_TASK_BY_ASSIGNED_TO_ID)
    async FetchTaskByAssignedToId(
        @Param(RequestParams.ASSIGNED_TO) assignedToId: string,
        @Query() taskFilters: TaskFilters,
        @Request() request: Req
    ) {
        return await this.taskService.FetchTaskByAssignedToId(taskFilters, assignedToId, request);
    }

    @Get(RouteConstants.API_FETCH_TASK_STATUS_SUMMARY)
    async fetchTaskStatusSummary(
        @Query() filters: TaskSummaryFilters,
        @Request() request: Req
    ) {
        return await this.taskService.fetchTaskStatusSummary(filters, request);
    }

    @Get(RouteConstants.API_FETCH_PENDING_APPROVAL_TASK)
    async fetchPendingApprovalTask(
        @Request() request: Req
    ) {
        return await this.taskService.fetchPendingApprovalTask(request);
    }
}
