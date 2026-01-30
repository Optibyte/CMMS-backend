import { IsString, IsOptional, IsUUID, IsNumber } from "class-validator";

export class RemarksDto {

    @IsString()
    @IsOptional()
    id: number;

    @IsString()
    @IsOptional()
    remark: string;
}
export class UpdateTaskDto {
    @IsString()
    @IsOptional()
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

    @IsUUID()
    @IsOptional()
    approvedBy: string;

    @IsUUID()
    @IsOptional()
    assignedTo: string;

    @IsOptional()
    createdByRemarks: string;

    @IsOptional()
    assignedToRemarks: string;
}