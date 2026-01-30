import { IsString, IsOptional, IsUUID, IsNotEmpty, IsNumber } from 'class-validator';
import { ChecklistEntity } from '../../checklist/entities/checklist.entity';

export class CreateTaskDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsNumber()
    @IsOptional()
    status: number;

    @IsOptional()
    startDate: Date;

    @IsOptional()
    dueDate: Date;

    @IsString()
    @IsOptional()
    priority: number;

    @IsUUID()
    @IsOptional()
    asset: string;

    @IsString()
    @IsOptional()
    estimatedLaborTime: string;

    @IsString()
    @IsOptional()
    type: string;

    @IsString()
    @IsOptional()
    parentId: string;

    @IsOptional()
    createdByRemarks: string;

    @IsOptional()
    checklists: ChecklistEntity[];
}

export class ApproveTaskDto {
    @IsNotEmpty()
    approveStatus: number;

    @IsOptional()
    @IsString()
    remarks: string;
}

export class TaskSummaryFilters{
    @IsOptional()
    year: string;

    @IsOptional()
    month: string;
}