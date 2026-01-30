import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, JoinColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { IsEmail } from 'class-validator';
import { RoleEntity } from '../../role-permissions/entities/role.entity';

@Entity('users')
export class UserEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'username', unique: true, nullable: false })
    username: string;

    @Column({ name: 'first_name', nullable: true })
    firstName: string;

    @Column({ name: 'last_name', nullable: true })
    lastName: string;

    @Column({ name: 'email', unique: true, nullable: true })
    @IsEmail()
    email: string;

    @Column({ name: 'password', nullable: false })
    password: string;

    @Column({ name: 'mobile_number', nullable: true })
    mobileNumber: string;

    @Column({ name: 'profile_picture', type: 'varchar', nullable: true })
    profilePicture: string;

    @ManyToMany(() => UserEntity, (user) => user.supervisees)
    @JoinTable({
        name: 'user_supervisor',
        joinColumn: { name: 'user_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'supervisor_id', referencedColumnName: 'id' },
    })
    supervisors: UserEntity[];

    @ManyToMany(() => UserEntity, (user) => user.supervisors)
    supervisees: UserEntity[];

    @Column({ name: 'is_deleted', default: false })
    isDeleted: boolean;

    @Column({ name: 'deleted_by', nullable: true })
    deletedBy: string;

    @Column({ name: 'created_by', nullable: true })
    createdBy: string;

    @Column({ name: 'updated_by', nullable: true })
    updatedBy: string;

    @ManyToOne(() => RoleEntity, role => role.id, { eager: true })
    @JoinColumn({ name: 'role_id' })
    role: number;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
    updatedAt: Date;
}
