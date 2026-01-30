export interface TaskFilters {
    status: string;
    startDate: string;
    endDate: string;
    offset: number;
    limit: number;
    date: string;
}

export enum TaskStatus {
    TO_DO = 0,
    PENDING = 1,
    IN_PROGRESS = 2,
    COMPLETED = 3,
    APPROVED = 4,
    PENDING_APPROVAL = 5,
    SUBMITTED = 6,
    OVERDUE = 7
}

export const TaskStatusLabels = {
    [TaskStatus.TO_DO]: 'To Do',
    [TaskStatus.PENDING]: 'Pending',
    [TaskStatus.IN_PROGRESS]: 'In Progress',
    [TaskStatus.COMPLETED]: 'Completed',
    [TaskStatus.APPROVED]: 'Approved',
    [TaskStatus.PENDING_APPROVAL]: 'Pending Approval',
    [TaskStatus.SUBMITTED]: 'Submitted',
    [TaskStatus.OVERDUE]: 'Overdue'
};