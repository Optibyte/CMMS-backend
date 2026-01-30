import { Body, Controller, Param, Put, Request } from '@nestjs/common';
import { RouteConstants } from '../constants/route-constants';
import { UpdateChecklistDto } from '../checklist/dto/checklist.dto';
import { RequestParams } from '../constants/message-constants';
import { ChecklistService } from './checklist.service';
import { Request as Req } from '../users/user.interface';

@Controller()
export class Checklistontroller {

    constructor(
        public readonly checklistService: ChecklistService
    ) { }

    @Put(RouteConstants.API_UPDATE_CHEKLIST_BY_ID)
    async updateChecklist(
        @Param(RequestParams.ID) id: string,
        @Param(RequestParams.TASK_ID) taskId: string,
        @Body() updateChecklistDto: UpdateChecklistDto,
        @Request() request: Req
    ) {
        return this.checklistService.updateChecklist(id, taskId, updateChecklistDto, request);
    }
}