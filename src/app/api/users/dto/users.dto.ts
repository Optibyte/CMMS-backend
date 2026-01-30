import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Matches, MaxLength, MinLength } from "class-validator"

export class CreateUserDto {

    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(15)
    @Matches(/^[a-z0-9]+([._]?[a-z0-9]+)*$/, {
        message: 'Username must contain only lowercase letters, numbers, and optionally single underscores or periods (not consecutively).',
    })
    username: string;

    @IsOptional()
    @IsString()
    firstName: string;

    @IsOptional()
    @IsString()
    lastName: string;

    @IsOptional()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    @MaxLength(15)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?!.*@.*@)[A-Za-z\d@$!%*?&]{8,}$/, {
        message: 'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character.',
    })
    password: string;

    @IsOptional()
    @IsString()
    mobileNumber: string;

    @IsOptional()
    @IsNumber()
    role: number;

    @IsOptional()
    @IsUUID(undefined, { each: true })
    supervisorIds?: string[];
}


export class UpdateUserDto {

    @IsOptional()
    @MinLength(6)
    @MaxLength(15)
    @Matches(/^[a-z0-9]+([._]?[a-z0-9]+)*$/, {
        message: 'Username must contain only lowercase letters, numbers, and optionally single underscores or periods (not consecutively).',
    })
    username: string;

    @IsOptional()
    @IsString()
    firstName: string;

    @IsOptional()
    @IsString()
    lastName: string;

    @IsOptional()
    @IsEmail()
    email: string;

    @IsOptional()
    @IsString()
    mobileNumber: string;

    @IsOptional()
    @IsNumber()
    role: number;

    @IsOptional()
    @IsUUID(undefined, { each: true })
    supervisorIds?: string[];
}

export class ResetPasswordDto {

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    @MaxLength(15)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?!.*@.*@)[A-Za-z\d@$!%*?&]{8,}$/, {
        message: 'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character.',
    })
    password: string;

}