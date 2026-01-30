import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('audit_logs')
export class AuditLogEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'action_type', })
    actionType: string;

    @Column({ name: 'action_by', })
    actionBy: string;

    @Column("jsonb")
    data: any;

    @CreateDateColumn({ name: 'action_date', type: 'timestamp with time zone' })
    actionDate: Date;
};
