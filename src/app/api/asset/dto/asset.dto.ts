import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsArray, IsOptional, IsNumber, IsObject, IsUrl, IsNotEmpty, ValidateNested } from 'class-validator';

export class ChecklistsDto {

    @IsString()
    @IsOptional()
    question: string;

    @IsString()
    @IsOptional()
    questionType: string;

    @IsOptional()
    option: object;

    @IsString()
    @IsOptional()
    description: string;

    @IsOptional()
    status: number;

    @IsString()
    @IsOptional()
    remarks: string;

    @IsString()
    @IsOptional()
    expectedAnswer: string;

    @IsString()
    @IsNotEmpty()
    category: string;
}
export class CreateAssetDto {

    @IsOptional()
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    category: string;

    @IsOptional()
    @IsString()
    code: string;

    @IsObject()
    @IsOptional()
    metadata: any;

    @IsArray()
    photos: string[];

    @IsString()
    @IsOptional()
    specifications: string;

    @IsObject()
    @IsOptional()
    location: object;

    @IsString()
    @IsOptional()
    localLabel: string;

    @IsString()
    @IsOptional()
    parentId?: string;


    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ChecklistsDto)
    @ApiProperty({
        type: [ChecklistsDto],
        isArray: true,
    })
    checklists: ChecklistsDto[];
}

export class AssetFilters {
    @IsOptional()
    code: string;

    @IsOptional()
    title: string;
}

export class UpdateAssetDto extends PartialType(CreateAssetDto) { }