import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoggerService } from 'src/logger/logger.service';
import { DatabaseNames, LogsLevelConstant } from '../constants/message-constants';
import { UpdateChecklistDto } from '../checklist/dto/checklist.dto';
import { ChecklistEntity } from '../checklist/entities/checklist.entity';
import { Request as Req } from '../users/user.interface';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { ActionTypeEnum } from '../audit-logs/audit-logs.interface';
import { NotificationService } from '../notifications/notifications.service';
import { checklistUpdateNotification, createTaskNotificationMessage } from '../notifications/utils/notification.utils';
import { TaskService } from '../task/task.service';
import { TaskStatusLabels } from '../task/task.interface';

@Injectable()
export class ChecklistService {
    constructor(
        @InjectRepository(ChecklistEntity, DatabaseNames.CMMS_DB)
        private readonly checklistRepository: Repository<ChecklistEntity>,
        private readonly loggerService: LoggerService,
        private readonly auditLogsService: AuditLogsService,
        private readonly notificationService: NotificationService,
        private readonly taskService: TaskService
    ) { }

    async updateChecklist(id: string, taskId: string, updateChecklistDto: UpdateChecklistDto, request: Req) {
        try {
            const actionBy = request?.user?.id;
            const username = request?.user?.username;

            // Find the existing checklist
            const checklist = await this.checklistRepository.findOne({ where: { id } });
            if (!checklist) {
                throw new HttpException(`Checklist with ID ${id} not found`, HttpStatus.NOT_FOUND);
            }

            // Save the updated checklist
            console.log('Updating checklist photos:', updateChecklistDto.photos);
            await this.checklistRepository.update(id, updateChecklistDto);
            const task = await this.taskService.findOne(taskId);

            // Use the utility function to create the notification payload
            const notificationPayload = checklistUpdateNotification(task.title, username, TaskStatusLabels[updateChecklistDto.status]);

            // Send the notification to the supervisor.
            this.notificationService.createNotification(task.createdBy.id, taskId, notificationPayload, actionBy);

            this.auditLogsService.createChecklistLog(actionBy, taskId, { checklistId: id, ...updateChecklistDto });

        } catch (error) {
            this.loggerService.loggerService({ level: LogsLevelConstant.ERROR, message: error?.message });
            throw new HttpException(error.message, error?.status);
        }
    }
}
