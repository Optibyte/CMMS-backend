import { IsObject, IsOptional, IsString } from "class-validator";

export class UpdateChecklistDto {
    @IsOptional()
    @IsString()
    question: string;

    @IsOptional()
    @IsString()
    questionType: string;

    @IsOptional()
    @IsObject()
    option: object;

    @IsOptional()
    @IsString()
    description: string;

    @IsOptional()
    status: number;

    @IsOptional()
    @IsString()
    remarks: string;

    @IsOptional()
    @IsString()
    expectedAnswer: string;
}