export interface Filters {
    name: string;
    description: string;
}

export enum RoleEnum {
    ENGINEER = 'ENGINEER',
    TECHNICIAN = 'TECHNICIAN',
    HOD = 'HOD',
    HO = 'HOO',
    CXO = 'CEO',
}

export enum PermissionsEnum {
    CREATE_TASK = 'CREATE_TASK',
    VIEW_CREATED_TASK = 'VIEW_CREATED_TASK',
    APPROVE_TASKS = 'APPROVE_TASKS',
    CREATE_USERS = 'CREATE_USERS'
}