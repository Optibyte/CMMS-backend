// To Generates a notification payload with a title and message for task-related actions.
export const createTaskNotificationMessage = (actionBy: string, taskTitle: string) => {
    return {
        message: `${actionBy} has created a new task titled '${taskTitle}'. Please review and approve the task.`,
        title: `New Task Created by ${actionBy}`,
    };
};

// To generate a task approval notification message
export const TaskApprovalNotification = (taskTitle: string, actionBy: string) => {
    return {
        message: `Task titled '${taskTitle}' has been approved by ${actionBy}.`,
        title: `Task Approved: ${taskTitle}`,
    };
};

// To generate a task assigned notification message
export const TaskAssignedNotification = (assignedBy: string, taskTitle: string) => {
    return {
        message: `Task titled '${taskTitle}' has been assigned to you by ${assignedBy}.`,
        title: `New Task Assigned: ${taskTitle}`,
    };
};

export const checklistUpdateNotification = (taskTitle: string, username: string, status: string) => {
    return {
        message: `The checklist item for task titled '${taskTitle}' has been updated by ${username}. The checklist status is now ${status}.`,
        title: 'Checklist Updated',
    };
}