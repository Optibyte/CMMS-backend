import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, ManyToMany } from 'typeorm';
import { RoleEntity } from './role.entity';

@Entity('permission')
export class PermissionEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'name', unique: true })
    name: string;

    @Column({ name: 'code', unique: true, nullable: true })
    code: string;

    @Column({ name: 'description', nullable: true })
    description: string;

    @ManyToMany(() => RoleEntity, (role: RoleEntity) => role.permissions)
    roles: RoleEntity[];

    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
    updatedAt?: Date
}
