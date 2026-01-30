import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { AssetEntity } from './asset.entity';

@Entity('logbook')
export class LogbookEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'dynamic_parameters', type: 'jsonb' })
    dynamicParameters: object;

    @Column()
    frequency: string;

    @ManyToOne(() => AssetEntity, asset => asset.logbooks)
    @JoinColumn({ name: 'asset_id' })
    asset: AssetEntity;
}
