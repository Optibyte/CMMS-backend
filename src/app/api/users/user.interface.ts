import { RouteInfo } from "@nestjs/common/interfaces";

export interface Request {
    body: object;
    user: any;
    route: RouteInfo;
}

export interface UserResponse {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    mobileNumber: string;
    role: Role;
    permissions: string[];
    createdAt: Date;
    updatedAt: Date;
    isDeleted: string;
}


export interface UserFilters {
    username?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    isDeleted?: boolean;
    mobileNumber?: string;
    offset?: number;
    limit?: number;
    role: string;
}

export interface Role {
    id: number;
    name: string;
    code: string;
}