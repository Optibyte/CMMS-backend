import { Injectable } from '@nestjs/common';
import { UserEntity } from '../users/entities/user.entity';

@Injectable()
export class NormalizeService {
    constructor() {
        console.error('🚀 🚀 🚀 NORMALIZE SERVICE INITIALIZING... 🚀 🚀 🚀');
    }

    public normalizeuser(user) {
        if (!user) {
            return undefined;
        }
        const normalizedData = {
            id: user.id,
            username: user.username,
            email: user.email,
            profilePicture: user?.profilePicture,
            firstName: user.firstName,
            lastName: user.lastName,
            mobileNumber: user.mobileNumber,
            role: this.normalizeRoleWithPermission(user?.role),
            permissions: user?.role?.permissions?.map(permission => permission.name) || [],
            supervisors: user?.supervisors?.map((item: UserEntity) => item.id),
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            isDeleted: user.isDeleted
        };
        return normalizedData;
    }

    public normalizeRoleWithPermission(role) {
        if (!role) {
            return undefined;
        }
        const normalizedData = {
            id: role?.id,
            name: role?.name,
            code: role?.code,
        };
        return normalizedData;
    }

    public normalizeTask(task) {
        if (!task) {
            return undefined;
        }
        const normalizedData = {
            id: task.id,
            title: task.title,
            description: task.description,
            code: task?.code,
            estimatedLaborTime: task?.estimatedLaborTime,
            type: task?.type,
            parentId: task?.parentId,
            status: this.normalizeWorkflowStatus(task.status) || null,
            startDate: task.startDate,
            dueDate: task.dueDate,
            priority: this.normalizeWorkflowPriority(task.priority) || null,
            assignedDate: task.assignedDate || null,
            approvedDate: task.approveDate,
            approveStatus: task.approveStatus,
            isDeleted: task.isDeleted,
            remarks: task.remarks,
            createdAt: task.createdAt,
            updatedAt: task.updatedAt,
            assignedTo: this.normalizeuser(task.assignedTo) || null,
            approvedBy: this.normalizeuser(task.approvedBy) || null,
            createdBy: this.normalizeuser(task.createdBy) || null,
            asset: this.normalizeTaskAsset(task?.asset) || null,
            checklists: task?.checklists?.map((item) => this.normalizeChecklist(item)) || [],
            createdByRemarks: task?.createdByRemarks,
            assignedToRemarks: task?.assignedToRemarks,
            approvedByRemarks: task?.approvedByRemarks
        };

        return normalizedData;
    }

    public normalizeTaskAsset(asset) {
        if (!asset) {
            return undefined;
        }

        const normalizedData = {
            id: asset.id,
            title: asset.title,
            category: asset.category,
            metadata: asset.metadata,
            photos: asset.photos || [],
            specifications: asset.specifications,
            location: asset.location,
            localLabel: asset.localLabel,
            qrCode: this.normalizeQrCode(asset?.qrCode),
            code: asset.code,
            createdAt: asset.createdAt,
            updatedAt: asset.updatedAt,
            isDeleted: asset.isDeleted
        };

        return normalizedData;
    }

    public normalizeChecklist(checklist) {
        if (!checklist) {
            return undefined;
        }
        const normalizedData = {
            id: checklist.id,
            question: checklist.question,
            questionType: checklist.questionType,
            option: checklist.option,
            description: checklist.description,
            status: this.normalizeWorkflowStatus(checklist?.status) || null,
            remarks: checklist.remarks,
            expectedAnswer: checklist.expectedAnswer,
            category: checklist.category,
            photos: checklist.photos || []
        };

        return normalizedData;
    }

    public normalizeWorkflowStatus(data) {
        if (!data) {
            return undefined;
        }
        return {
            value: data.value,
            label: data.label
        };
    }

    public normalizeWorkflowPriority(data) {
        if (!data) {
            return undefined;
        }
        return {
            value: data.value,
            label: data.label
        };
    }

    public normalizeRemarks(data) {
        if (!data) {
            return undefined;
        }
        return {
            id: data.id,
            remark: data.remark
        };
    }

    public normalizeNotifications(data) {
        if (!data) {
            return undefined;
        }
        return {
            id: data.id,
            title: data.title,
            message: data.message,
            isRead: data.isRead,
            userId: data.user.id,
            taskId: data.task.id,
            actionBy: this.normalizeuser(data.actionBy),
            createdAt: data.createdAt,
        };
    }

    public normalizeAsset(asset) {
        if (!asset) {
            return undefined;
        }

        const normalizedData = {
            id: asset.id,
            title: asset.title,
            category: asset.category,
            metadata: asset.metadata,
            photos: asset.photos || [],
            specifications: asset.specifications,
            location: asset.location,
            localLabel: asset.localLabel,
            checklists: asset?.checklists?.map((item) => this.normalizeChecklist(item)) || [],
            code: asset.code,
            createdAt: asset.createdAt,
            updatedAt: asset.updatedAt,
            isDeleted: asset.isDeleted
        };
        return normalizedData;
    }

    public groupByCategory(values) {
        const groupedByCategory = values.reduce((acc, checklist) => {
            // Check if the category already exists in the accumulator
            if (!acc[checklist.category]) {
                acc[checklist.category] = [];
            }
            // Push the checklist to the appropriate category
            acc[checklist.category].push(checklist);
            return acc;
        }, {});

        return groupedByCategory;
    }

    public normalizeQrCode(data) {
        if (!data) {
            return undefined;
        }
        return {
            id: data.id,
            metadata: data.metadata,
            code: data.code
        };
    }
}