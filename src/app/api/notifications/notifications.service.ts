import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationEntity } from './entities/notification.entity';
import { LoggerService } from 'src/logger/logger.service';
import { DatabaseNames, LogsLevelConstant } from '../constants/message-constants';
import { NormalizeService } from '../shared/normalize.service';

@Injectable()
export class NotificationService {
    constructor(
        private readonly loggerService: LoggerService,
        private readonly normalizeService: NormalizeService,
        @InjectRepository(NotificationEntity, DatabaseNames.CMMS_DB)
        private readonly notificationRepository: Repository<NotificationEntity>,
    ) { }

    async createNotification(userId: string, taskId: string, { message, title }, actionBy: string) {
        try {
            const notification = new NotificationEntity();
            notification.user = userId;
            notification.task = taskId;
            notification.message = message;
            notification.title = title;
            notification.actionBy = actionBy;
            
            // Save notification to database
            const response = await this.notificationRepository.save(notification);
            this.loggerService.loggerService({
                level: LogsLevelConstant.INFO,
                message: `Notification created successfully with Id: ${response.id}`,
            });
        } catch (error) {
            this.loggerService.loggerService({ level: LogsLevelConstant.ERROR, message: error?.message });
            throw new HttpException(error?.message, error?.status);
        }
    }

    async markAsRead(notificationId: string) {
        try {
            const notification = await this.notificationRepository.findOne({ where: { id: notificationId } });
            if (!notification) {
                throw new HttpException('Notification not found', HttpStatus.NOT_FOUND);
            }
            notification.isRead = true;
            await this.notificationRepository.save(notification);
            return { message: 'Notification marked as read.' };
        } catch (error) {
            this.loggerService.loggerService({ level: LogsLevelConstant.ERROR, message: error?.message });
            throw new HttpException(error?.message, error?.status);
        }
    }

    async getNotificationsByUserId(userId: string, offset: number, limit: number, isRead?: boolean) {
        try {
            // Initialize the query builder
            const queryBuilder = this.notificationRepository
                .createQueryBuilder('notification')
                .leftJoinAndSelect('notification.user', 'user')
                .leftJoinAndSelect('notification.task', 'task')
                .leftJoinAndSelect('notification.actionBy', 'actionBy')
                .where('notification.user_id = :userId', { userId })
                .orderBy('notification.createdAt', 'DESC')  // Ordering notifications directly here
                .skip(offset)
                .take(limit);

            if (isRead !== undefined) {
                queryBuilder.andWhere('notification.is_read = :isRead', { isRead });
            }

            const [notifications, total] = await queryBuilder.getManyAndCount();

            let unreadCount = await this.notificationRepository
                .createQueryBuilder('notification')
                .where('notification.user_id = :userId', { userId })
                .andWhere('notification.is_read = :isRead', { isRead: false }) // Default to unread notifications
                .getCount();

            return {
                unreadMessageCount: unreadCount,
                notifications: notifications.map((item) => this.normalizeService.normalizeNotifications(item)),
                pagination: {
                    totalCount: total,
                    currentPage: Math.ceil(offset / limit) + 1,
                    totalPages: Math.ceil(total / limit),
                    limit,
                    offset,
                },
            };

        } catch (error) {
            this.loggerService.loggerService({ level: LogsLevelConstant.ERROR, message: error?.message || 'Unknown error' });
            throw new HttpException(error?.message || 'Internal server error', error?.status || 500);
        }
    }
    
}
