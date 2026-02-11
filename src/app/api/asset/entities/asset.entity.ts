import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { QrCodeEntity } from './qr-code.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { ChecklistEntity } from '../../checklist/entities/checklist.entity';
import { LogbookEntity } from './logbook.entity';
import { TaskEntity } from '../../task/entities/task.entity';

@Entity('assets')
export class AssetEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'title', type: 'varchar' })
    title: string;

    @Column({ type: 'text', nullable: true, unique: true })
    code: string;

    @Column({ name: 'category', type: 'varchar', nullable: true })
    category: string;

    @Column({ name: 'metadata', type: 'jsonb', nullable: true })
    metadata: object;

    @Column({ name: 'photos', type: 'json', nullable: true })
    photos: string[];

    @Column({ name: 'specifications', type: 'text', nullable: true })
    specifications: string;

    @Column({ name: 'location', type: 'jsonb', nullable: true })
    location: object;

    @Column({ name: 'local_label', nullable: true })
    localLabel: string;

    @Column({ name: 'parent_id', nullable: true })
    parentId: string;

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

    @OneToOne(() => QrCodeEntity, { eager: true, cascade: true })
    @JoinColumn({ name: 'qr_code_id' })
    qrCode: QrCodeEntity;

    @OneToMany(() => LogbookEntity, logbook => logbook.asset, { cascade: true })
    logbooks: LogbookEntity[];

    @OneToMany(() => ChecklistEntity, checklist => checklist.asset, { cascade: true, eager: true })
    checklists: ChecklistEntity[];

    @OneToMany(() => TaskEntity, tasks => tasks.asset)
    tasks: TaskEntity[];

    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
    updatedAt: Date;
}
