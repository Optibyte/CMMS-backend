import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToMany, JoinTable, JoinColumn, ManyToOne } from 'typeorm';
import { PermissionEntity } from './permission.entity';
import { UserEntity } from '../../users/entities/user.entity';

@Entity('role')
export class RoleEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'name', unique: true })
    name: string;

    @Column({ name: 'code', unique: true, nullable: true })
    code: string;

    @Column({ name: 'description', nullable: true })
    description: string;

    @ManyToMany(() => PermissionEntity, (permission: PermissionEntity) => permission.roles, { cascade: true, eager: true })
    @JoinTable({
        name: 'role_permissions',
        joinColumn: {
            name: 'role_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'permission_id',
            referencedColumnName: 'id',
        },
    })
    permissions: PermissionEntity[];

    @ManyToOne(() => UserEntity, (user) => user.id)
    @JoinColumn({ name: 'created_by' })
    createdBy: string;

    @ManyToOne(() => UserEntity, (user) => user.id)
    @JoinColumn({ name: 'updated_by' })
    updatedBy: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
    updatedAt?: Date
}
