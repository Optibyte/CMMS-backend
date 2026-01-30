import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { TaskEntity } from "../../task/entities/task.entity";
import { UserEntity } from "../../users/entities/user.entity";

@Entity('checklist_audit_logs')
export class ChecklistAuditLogEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UserEntity, user => user.id)
    @JoinColumn({ name: 'user_id' })
    user: string;

    @Column("jsonb")
    data: any;

    @ManyToOne(() => TaskEntity, task => task.id)
    @JoinColumn({ name: 'task_id' })
    task: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
    updatedAt: Date;
};
