import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TaskEntity } from "../../task/entities/task.entity";
import { UserEntity } from "../../users/entities/user.entity";

@Entity('notifications')
export class NotificationEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @Column({ name: 'title', type: 'text', nullable: true})
    title: string;

    @ManyToOne(() => TaskEntity, (task) => task.id)
    @JoinColumn({ name: 'task_id' })
    task: string;

    @ManyToOne(() => UserEntity, (user) => user.id)
    @JoinColumn({ name: 'user_id' })
    user: string;

    @ManyToOne(() => UserEntity, (user) => user.id)
    @JoinColumn({ name: 'action_by' })
    actionBy: string;

    @Column({ name: 'message', type: 'text' })
    message: string;

    @Column({ name: 'is_read', type: 'boolean', default: false })
    isRead: boolean;

    @Column({ type: "jsonb", nullable: true })
    metadata: any;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
    createdAt: Date;
}
