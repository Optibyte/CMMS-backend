import { Controller, Get, Param, Put, Query } from '@nestjs/common';
import { NotificationService } from './notifications.service';
import { RouteConstants } from '../constants/route-constants';
import { RequestParams } from '../constants/message-constants';

@Controller()
export class NotificationController {
    constructor(
        private readonly notificationService: NotificationService
    ) { }

    @Get(RouteConstants.API_FECTH_NOTIFICATION_BY_USERID)
    async getNotificationsByUserId(
        @Param(RequestParams.USER_ID) userId: string,
        @Query(RequestParams.OFFSET) offset: number,
        @Query(RequestParams.LIMIT) limit: number,
        @Query(RequestParams.ISREAD) isRead: boolean
    ) {
        return this.notificationService.getNotificationsByUserId(userId, offset, limit,isRead);
    }

    @Put(RouteConstants.API_NOTIFICATION_MARKS_AS_READ)
    async markAsRead(
        @Param(RequestParams.ID) notificationId: string
    ) {
        return await this.notificationService.markAsRead(notificationId);

    }
}
