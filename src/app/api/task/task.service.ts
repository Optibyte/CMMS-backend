import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ApproveTaskDto, CreateTaskDto, TaskSummaryFilters } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { LoggerService } from 'src/logger/logger.service';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from './entities/task.entity';
import { DatabaseNames, DefaultConstant, FIELDS_CONSTANTS, LogsLevelConstant } from '../constants/message-constants';
import { In, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { Request as Req } from '../users/user.interface';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { ActionTypeEnum } from '../audit-logs/audit-logs.interface';
import { TaskFilters } from './task.interface';
import { NormalizeService } from '../shared/normalize.service';
import { NotificationService } from '../notifications/notifications.service';
import { UsersService } from '../users/user.service';
import { createTaskNotificationMessage, TaskApprovalNotification, TaskAssignedNotification } from '../notifications/utils/notification.utils';
import { ChecklistEntity } from '../checklist/entities/checklist.entity';

import { RedisCacheService } from 'src/redis-cache/redis-cache.service';

@Injectable()
export class TaskService {

    constructor(
        private readonly loggerService: LoggerService,
        private readonly AuditLogsService: AuditLogsService,
        private readonly normalizeService: NormalizeService,
        private readonly notificationService: NotificationService,
        private readonly userService: UsersService,
        private readonly redisCacheService: RedisCacheService,
        @InjectRepository(TaskEntity, DatabaseNames.CMMS_DB)
        private readonly taskRepository: Repository<TaskEntity>,
        @InjectRepository(ChecklistEntity, DatabaseNames.CMMS_DB)
        private readonly checkListRepository: Repository<ChecklistEntity>,
    ) { }

    async create(taskDto: CreateTaskDto, request: Req) {
        try {
            const userId = request?.user?.id;

            taskDto[FIELDS_CONSTANTS.CREATED_BY] = userId;
            taskDto[FIELDS_CONSTANTS.UPDATED_BY] = userId;
            taskDto[FIELDS_CONSTANTS.STATUS] = DefaultConstant.TO_DO;
            taskDto[FIELDS_CONSTANTS.APPROVE_STATUS] = DefaultConstant.PENDING_APPROVAL;

            // Get the next value for the sequence
            const nextValue = await this.taskRepository.query(`SELECT nextval('wo_sequence')`);

            const woCode = `WO${nextValue[0].nextval}`;

            // Add the WO code to the task DTO
            taskDto[FIELDS_CONSTANTS.CODE] = woCode;
            const checklistIds = taskDto.checklists.map((item) => item.id);
            delete taskDto.checklists;

            const saveTask = await this.taskRepository.save(taskDto);

            await this.createTaskCheckList(saveTask.id, checklistIds);

            this.loggerService.loggerService({
                level: LogsLevelConstant.INFO,
                message: `Task created successfully with ID: ${saveTask.id}`,
            });

            this.AuditLogsService.create(ActionTypeEnum.CREATE_TASK, userId, saveTask);
            const supervisors = request?.user.supervisors;
            supervisors.map((id: string) => {
                // Use the utility function to create the notification payload
                const notificationPayload = createTaskNotificationMessage(request?.user?.username, saveTask.title)
                // Send the notification to the supervisor.
                this.notificationService.createNotification(id, saveTask.id, notificationPayload, userId);
            })

            return {
                message: 'Task created successfully.',
                taskId: saveTask.id,
                code: saveTask.code,
            };
        } catch (error) {
            this.loggerService.loggerService({ level: LogsLevelConstant.ERROR, message: error?.message });
            throw new HttpException(error?.message, error?.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async update(id: string, updateTaskDto: UpdateTaskDto, request: Req) {
        try {

            const existingTask = await this.taskRepository.findOne({
                where: { id }
            });

            if (!existingTask) {
                throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
            }
            const userId = request?.user?.id;
            updateTaskDto[FIELDS_CONSTANTS.UPDATED_BY] = userId;

            await this.taskRepository.update(id, updateTaskDto);

            this.loggerService.loggerService({
                level: LogsLevelConstant.INFO,
                message: `Task updated successfully with ID: ${id}`,
            });
            this.AuditLogsService.create(ActionTypeEnum.UPDATE_TASK, userId, { taskId: id, ...updateTaskDto });
        } catch (error) {
            this.loggerService.loggerService({ level: LogsLevelConstant.ERROR, message: error?.message });
            throw new HttpException(error?.message, error?.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private async enrichTasksWithPhotos(tasks: TaskEntity[]) {
        for (const task of tasks) {
            if (task.checklists) {
                for (const checklist of task.checklists) {
                    const cachedPhotos = await this.redisCacheService.get(`checklist_photos:${checklist.id}`);
                    if (cachedPhotos) {
                        checklist.photos = cachedPhotos;
                    }
                }
            }
        }
    }

    async findAll(filters: TaskFilters, request: Req) {
        try {
            const { status, startDate, endDate, offset = 0, limit = 10 } = filters;

            const engineerId = request.user.id;

            const queryBuilder = this.taskRepository.createQueryBuilder('task')
                .leftJoinAndSelect('task.assignedTo', 'assignedTo')
                .leftJoinAndSelect('task.approvedBy', 'approvedBy')
                .leftJoinAndSelect('task.status', 'status')
                .leftJoinAndSelect('task.approveStatus', 'approveStatus')
                .leftJoinAndSelect('task.priority', 'priority')
                .leftJoinAndSelect('task.asset', 'asset')
                .leftJoinAndSelect('task.checklists', 'checklists')
                .leftJoinAndSelect('checklists.status', 'checklistStatus');

            // Filter: Created by the engineer
            queryBuilder.where('task.createdBy = :engineerId', { engineerId });

            // Filter: Status
            if (status) {
                queryBuilder.andWhere('task.status = :status', { status });
            }

            // Filter: Date range
            if (filters?.startDate && filters?.endDate) {
                queryBuilder.andWhere('task.createdAt BETWEEN :startDate AND :endDate', {
                    startDate,
                    endDate
                });
            }
            // Add pagination and sorting
            queryBuilder.skip(offset).take(limit).orderBy('task.createdAt', 'DESC');

            // Execute the query
            const [tasks, totalCount] = await queryBuilder.getManyAndCount();

            await this.enrichTasksWithPhotos(tasks);

            const normalizeTask = tasks.map((item) => this.normalizeService.normalizeTask(item));

            return {
                totalCount,
                task: normalizeTask
            };
        } catch (error) {
            this.loggerService.loggerService({ level: LogsLevelConstant.ERROR, message: error?.message });
            throw new HttpException(error?.message, error?.status);
        }
    }

    async findOne(id: string) {
        try {
            const task = await this.taskRepository.findOne({
                where: { id },
                relations: ['assignedTo', 'approvedBy', 'asset', 'createdBy']
            });
            if (!task) {
                throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
            }
            return this.normalizeService.normalizeTask(task);
        } catch (error) {
            this.loggerService.loggerService({ level: LogsLevelConstant.ERROR, message: error?.message });
            throw new HttpException(error?.message, error?.status);
        }
    }

    async approveTask(id: string, approveTaskDto: ApproveTaskDto, request: Req): Promise<any> {
        try {

            const userId = request.user.id;

            // Fetch the task
            const task = await this.taskRepository.findOne(
                { where: { id, isDeleted: false }, relations: ['createdBy'] }
            );
            if (!task) {
                throw new HttpException(`Task with ID ${id} not found.`, HttpStatus.NOT_FOUND);
            }

            approveTaskDto[FIELDS_CONSTANTS.APPROVED_BY] = userId;
            approveTaskDto[FIELDS_CONSTANTS.UPDATED_BY] = userId;
            approveTaskDto[FIELDS_CONSTANTS.UPDATED_AT] = new Date();
            approveTaskDto[FIELDS_CONSTANTS.APPROVED_DATE] = new Date();
            approveTaskDto[FIELDS_CONSTANTS.APPROVED_BY_REMARKS] = approveTaskDto.remarks;
            delete approveTaskDto.remarks

            // Save changes to the database
            await this.taskRepository.update(id, approveTaskDto);

            // Use the utility function to create the notification payload
            const notificationPayload = TaskApprovalNotification(task.title, request?.user?.username);
            // Send the notification
            await this.notificationService.createNotification(task.createdBy[FIELDS_CONSTANTS.ID], task.id, notificationPayload, userId);

            this.AuditLogsService.create(ActionTypeEnum.APPROVE_TASK, userId, { taskId: id, ...approveTaskDto });

            return {
                message: 'Task approved successfully.',
                taskId: id,
            };
        } catch (error) {
            this.loggerService.loggerService({ level: LogsLevelConstant.ERROR, message: error?.message });
            throw new HttpException(error?.message, error?.status);
        }
    }

    async assingedToTask(id: string, assignedToId: string, request: Req): Promise<any> {
        try {
            const assignedById = request.user.id;

            // Fetch the task
            const task = await this.taskRepository.findOne({ where: { id, isDeleted: false } });

            if (!task) {
                throw new HttpException(`Task with ID ${id} not found.`, HttpStatus.NOT_FOUND);
            }

            const payload = { assignedTo: assignedToId, assignedBy: assignedById, assignedDate: new Date() }
            // Save changes to the database
            await this.taskRepository.update(id, payload);

            // Use the utility function to create the notification payload
            const notificationPayload = TaskAssignedNotification(request?.user?.username, task.title);

            // Send the notification
            await this.notificationService.createNotification(assignedToId, task.id, notificationPayload, assignedById);

            this.AuditLogsService.create(ActionTypeEnum.ASSIGN_TASK, assignedById, { taskId: id, ...payload });

            return {
                message: 'Task assigned successfully.',
                assignedTo: assignedToId,
            };
        } catch (error) {
            this.loggerService.loggerService({ level: LogsLevelConstant.ERROR, message: error?.message });
            throw new HttpException(error?.message, error?.status);
        }
    }

    async FetchTaskByAssignedToId(filters: TaskFilters, assignedToId: string, request: Req) {
        try {
            const { date, status, startDate, endDate, offset = 0, limit = 10 } = filters;

            const queryBuilder = this.taskRepository.createQueryBuilder('task')
                .leftJoinAndSelect('task.assignedTo', 'assignedTo')
                .leftJoinAndSelect('task.approvedBy', 'approvedBy')
                .leftJoinAndSelect('task.status', 'status')
                .leftJoinAndSelect('task.approveStatus', 'approveStatus')
                .leftJoinAndSelect('task.priority', 'priority')
                .leftJoinAndSelect('task.asset', 'asset')
                .leftJoinAndSelect('task.checklists', 'checklists')
                .leftJoinAndSelect('checklists.status', 'checklistStatus');

            // Filter: Created by the assignedToId
            queryBuilder.where('task.assignedTo = :assignedToId', { assignedToId });

            // Filter: Status
            if (status) {
                queryBuilder.andWhere('task.status = :status', { status });
            }

            // Filter: Date range
            if (filters?.startDate && filters?.endDate) {
                queryBuilder.andWhere('task.assigned_date::DATE BETWEEN :startDate AND :endDate', {
                    startDate,
                    endDate
                });
            } else if (date) {
                queryBuilder.andWhere('task.assigned_date::DATE = :date', { date });
            }

            // Add pagination and sorting
            queryBuilder.skip(offset).take(limit).orderBy('task.assignedDate', 'DESC');

            // Execute the query
            const [tasks, totalCount] = await queryBuilder.getManyAndCount();

            await this.enrichTasksWithPhotos(tasks);

            const normalizeTask = tasks.map((item) => this.normalizeService.normalizeTask(item));
            return {
                totalCount,
                normalizeTask
            };
        } catch (error) {
            this.loggerService.loggerService({ level: LogsLevelConstant.ERROR, message: error?.message });
            throw new HttpException(error?.message, error?.status);
        }
    }

    async fetchTaskStatusSummary(filters: TaskSummaryFilters, request: Req) {
        try {
            let startDate: Date;
            let endDate: Date;

            const { year, month } = filters;

            const userId = request?.user?.id;
            const creatorIds = await this.userService.getUsersBySupervisorId(userId)
                .then(users => users.map(item => item.id));

            const queryBuilder = this.taskRepository
                .createQueryBuilder('task')
                .select('task.status', 'status')
                .addSelect('COUNT(*)', 'count')
                .where('task.createdBy IN (:...creatorIds)', { creatorIds })
                .groupBy('task.status')

            let whereConditions: any = { createdBy: In(creatorIds), };

            if (month && year) {
                // Convert month and year to a start and end date
                startDate = new Date(Number(year), Number(month) - 1, 1);
                endDate = new Date(Number(year), Number(month), 0);

                queryBuilder.andWhere('task.createdAt >= :startDate', { startDate })
                queryBuilder.andWhere('task.createdAt <= :endDate', { endDate })

                whereConditions.createdAt = MoreThanOrEqual(startDate);
                whereConditions.createdAt = LessThanOrEqual(endDate);
            }

            const response = await queryBuilder.getRawMany();

            // Query to get the total count of tasks filtered by creatorId and month/year
            const totalTasks = await this.taskRepository.count({
                where: whereConditions,
            });
            return {
                totalTasks,
                taskSummary: this.addTaskStatusPercentage(response, totalTasks),
            };
        } catch (error) {
            this.loggerService.loggerService({ level: LogsLevelConstant.ERROR, message: error?.message });
            throw new HttpException(error?.message, error?.status);
        }
    }

    public addTaskStatusPercentage(
        taskSummary: { status: number, count: string }[],
        totalTaskCount: number
    ) {
        const taskSummaryWithPercentage = taskSummary.map((task) => {
            const count = parseInt(task.count, 10);
            const percentage = ((count / totalTaskCount) * 100).toFixed(2);
            return { status: task.status, count: Number(task.count), percentage };
        });
        return taskSummaryWithPercentage;
    }

    async fetchPendingApprovalTask(request: Req) {
        try {
            const userId = request?.user?.id;
            const creatorIds = await this.userService.getUsersBySupervisorId(userId)
                .then(users => users.map(item => item.id));

            const queryBuilder = this.taskRepository
                .createQueryBuilder('task')
                .leftJoinAndSelect('task.assignedTo', 'assignedTo')
                .leftJoinAndSelect('task.approvedBy', 'approvedBy')
                .leftJoinAndSelect('task.status', 'status')
                .leftJoinAndSelect('task.approveStatus', 'approveStatus')
                .leftJoinAndSelect('task.priority', 'priority')
                .leftJoinAndSelect('task.asset', 'asset')
                .leftJoinAndSelect('task.checklists', 'checklists')
                .leftJoinAndSelect('checklists.status', 'checklistStatus')
                .andWhere('task.createdBy IN (:...creatorIds)', { creatorIds })
                .andWhere('task.approveStatus = :status', { status: 5 })

            // Add pagination and sorting
            queryBuilder.orderBy('task.createdAt', 'DESC');
            const [tasks, totalCount] = await queryBuilder.getManyAndCount();

            await this.enrichTasksWithPhotos(tasks);

            const task = tasks.map((item) => this.normalizeService.normalizeTask(item));

            return {
                totalCount,
                task
            }
        } catch (error) {
            this.loggerService.loggerService({ level: LogsLevelConstant.ERROR, message: error?.message });
            throw new HttpException(error?.message, error?.status);
        }
    }

    async createTaskCheckList(taskId: string, checklist: string[]) {
        try {
            let response = [];
            for (const id of checklist) {
                const checklist = await this.checkListRepository.findOne({ where: { id } });
                delete checklist.id;
                // Save the duplicated checklist
                const duplicateChecklist = await this.checkListRepository.save(checklist);
                response.push({ id: duplicateChecklist.id })
            }
            const task = await this.taskRepository.findOne({ where: { id: taskId } });
            task.checklists = response;
            await this.taskRepository.save(task);
        } catch (error) {
            this.loggerService.loggerService({ level: LogsLevelConstant.ERROR, message: error?.message });
            throw new HttpException(error?.message, error?.status);
        }
    }

    async addPhotoToChecklist(checklistId: string, photoUrl: string) {
        try {
            const checklist = await this.checkListRepository.findOne({ where: { id: checklistId } });
            if (!checklist) {
                throw new Error(`Checklist with ID ${checklistId} not found`);
            }
            const photos = checklist.photos || [];
            photos.push(photoUrl);
            await this.checkListRepository.update(checklistId, { photos });

            // Cache in Redis for faster access upon reload
            await this.redisCacheService.set(`checklist_photos:${checklistId}`, photos);

            return photos;
        } catch (error) {
            this.loggerService.loggerService({ level: LogsLevelConstant.ERROR, message: error?.message });
            throw error;
        }
    }

    async removePhotoFromChecklist(checklistId: string, photoUrl: string) {
        try {
            const checklist = await this.checkListRepository.findOne({ where: { id: checklistId } });
            if (!checklist) {
                throw new Error(`Checklist with ID ${checklistId} not found`);
            }
            let photos = checklist.photos || [];
            photos = photos.filter(url => url !== photoUrl);
            await this.checkListRepository.update(checklistId, { photos });

            // Update Redis cache
            await this.redisCacheService.set(`checklist_photos:${checklistId}`, photos);

            return photos;
        } catch (error) {
            this.loggerService.loggerService({ level: LogsLevelConstant.ERROR, message: error?.message });
            throw error;
        }
    }

    async getChecklistPhotos(checklistId: string) {
        try {
            // Try fetching from Redis first
            let photos = await this.redisCacheService.get(`checklist_photos:${checklistId}`);
            if (photos) {
                console.log(`DEBUG: Fetched photos for ${checklistId} from Redis`);
                return photos;
            }

            // Fallback to DB
            const checklist = await this.checkListRepository.findOne({ where: { id: checklistId } });
            if (!checklist) {
                throw new Error(`Checklist with ID ${checklistId} not found`);
            }

            photos = checklist.photos || [];
            // Update Redis cache for next time
            await this.redisCacheService.set(`checklist_photos:${checklistId}`, photos);

            return photos;
        } catch (error) {
            this.loggerService.loggerService({ level: LogsLevelConstant.ERROR, message: error?.message });
            throw error;
        }
    }
}