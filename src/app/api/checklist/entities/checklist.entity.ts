import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, ManyToMany } from 'typeorm';
import { AssetEntity } from '../../asset/entities/asset.entity';
import { WorkflowStatusEntity } from '../../task/entities/workflow-status.entity';
import { TaskEntity } from '../../task/entities/task.entity';

@Entity('checklist')
export class ChecklistEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true })
    question: string;

    @Column({ name: 'question_type', nullable: true })
    questionType: string;

    @Column({ type: 'jsonb', nullable: true })
    option: object;

    @Column({ nullable: true })
    description: string;

    @ManyToOne(() => WorkflowStatusEntity, (status) => status.value, { nullable: true, eager: true })
    @JoinColumn({ name: 'status' })
    status: number;

    @Column({ nullable: true })
    remarks: string;

    @Column({ name: 'expected_answer', nullable: true })
    expectedAnswer: string;

    @Column({ name: 'category', type: 'text', nullable: true })
    category: string;

    @Column({ name: 'photos', type: 'json', nullable: true })
    photos: string[];

    @ManyToOne(() => AssetEntity, asset => asset.checklists)
    @JoinColumn({ name: 'asset_id' })
    asset: AssetEntity;

    @ManyToMany(() => TaskEntity, (task) => task.checklists)
    tasks: TaskEntity[];
}
