import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { AssetEntity } from '../../asset/entities/asset.entity';
import { WorkflowStatusEntity } from './workflow-status.entity';
import { WorkflowPriorityEntity } from './workflow-priority.entity';
import { ChecklistEntity } from '../../checklist/entities/checklist.entity';

@Entity('tasks')
export class TaskEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar' })
    title: string;

    @Column({ type: 'text', nullable: true, unique: true })
    code: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @ManyToOne(() => WorkflowStatusEntity, (status) => status.value, { nullable: true, eager: true })
    @JoinColumn({ name: 'status' })
    status: number;

    @Column({ name: 'start_date', type: 'date', nullable: true })
    startDate: Date;

    @Column({ name: 'due_date', type: 'date', nullable: true })
    dueDate: Date;

    @ManyToOne(() => WorkflowPriorityEntity, (priority) => priority.value, { nullable: true, eager: true })
    @JoinColumn({ name: 'priority' })
    priority: number;

    @ManyToOne(() => AssetEntity, (asset) => asset.id, { nullable: true, eager: true })
    @JoinColumn({ name: 'asset_id' })
    asset: string;

    @ManyToOne(() => UserEntity, (user) => user.id, { nullable: true })
    @JoinColumn({ name: 'assigned_to' })
    assignedTo: string;

    @Column({ name: 'assigned_date', type: 'timestamp with time zone', nullable: true })
    assignedDate: Date;

    @ManyToOne(() => UserEntity, (user) => user.id, { nullable: true })
    @JoinColumn({ name: 'assigned_by' })
    assignedBy: string;

    @ManyToOne(() => UserEntity, (user) => user.id, { nullable: true })
    @JoinColumn({ name: 'approved_by' })
    approvedBy: string;

    @Column({ name: 'approved_date', type: 'timestamp with time zone', nullable: true })
    approvedDate: Date;

    @ManyToOne(() => WorkflowStatusEntity, (status) => status.value, { nullable: true, eager: true })
    @JoinColumn({ name: 'approve_status' })
    approveStatus: number;

    @Column({ name: 'is_deleted', default: false })
    isDeleted: boolean;

    @ManyToOne(() => UserEntity, (user) => user.id)
    @JoinColumn({ name: 'deleted_by' })
    deletedBy: string;

    @ManyToOne(() => UserEntity, (user) => user.id)
    @JoinColumn({ name: 'created_by' })
    createdBy: string;

    @ManyToOne(() => UserEntity, (user) => user.id)
    @JoinColumn({ name: 'updated_by' })
    updatedBy: string;

    @Column({ name: 'estimated_labor_time', nullable: true })
    estimatedLaborTime: string;

    @Column({ name: 'type', nullable: true })
    type: string;

    @Column({ name: 'parent_id', nullable: true })
    parentId: string;

    @Column({ name: 'approved_by_remarks', type: 'text', nullable: true })
    approvedByRemarks: string;

    @Column({ name: 'created_by_remarks', type: 'text', nullable: true })
    createdByRemarks: string;

    @Column({ name: 'assigned_to_remarks', type: 'text', nullable: true })
    assignedToRemarks: string;

    @ManyToMany(() => ChecklistEntity, (checklist) => checklist.tasks)
    @JoinTable({
        name: 'task_checklists',
        joinColumn: { name: 'task_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'checklist_id', referencedColumnName: 'id' },
    })
    checklists: ChecklistEntity[];

    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
    updatedAt: Date;
}
