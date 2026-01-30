import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('qr_codes')
export class QrCodeEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @Column({ name: 'metadata', type: 'jsonb' })
    metadata: object;

    @Column({ name: 'code' })
    code: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
    updatedAt: Date;
}