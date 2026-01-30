import { ApiProperty, PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsOptional, ValidateNested } from "class-validator";

export class PermissionDto {

    @IsOptional()
    @ApiProperty()
    id: number;

    @IsNotEmpty()
    @ApiProperty()
    name: string;

    @IsOptional()
    @ApiProperty()
    code: string;

    @IsOptional()
    @ApiProperty()
    description: string;
}

export class CreateRoleWithPermissionDto {

    @IsNotEmpty()
    @ApiProperty()
    name: string;

    @IsNotEmpty()
    @ApiProperty()
    code: string;

    @IsOptional()
    @ApiProperty()
    description: string;
    

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PermissionDto)
    @ApiProperty({
        description: 'Array of permissions associated with the role',
        type: [PermissionDto],
        isArray: true,
    })
    permissions: PermissionDto[];
}

export class UpdateRoleWithPermissionDto {

    @IsOptional()
    @ApiProperty()
    name: string;

    @IsOptional()
    @ApiProperty()
    code: string;

    @IsOptional()
    @ApiProperty()
    description: string;
    

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PermissionDto)
    @ApiProperty({
        description: 'Array of permissions associated with the role',
        type: [PermissionDto],
        isArray: true,
    })
    permissions: PermissionDto[];
}

export class UpdatePermissionDto extends PartialType(PermissionDto) {}