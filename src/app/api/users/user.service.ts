import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoggerService } from 'src/logger/logger.service';
import { DatabaseNames, FIELDS_CONSTANTS, LogsLevelConstant } from '../constants/message-constants';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateUserDto, ResetPasswordDto, UpdateUserDto } from './dto/users.dto';
import * as bcrypt from 'bcrypt';
import { Request as Req, UserFilters } from '../users/user.interface';
import { NormalizeService } from '../shared/normalize.service';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { ActionTypeEnum } from '../audit-logs/audit-logs.interface';

@Injectable()
export class UsersService {

    constructor(
        private readonly loggerService: LoggerService,
        private readonly normalizeService: NormalizeService,
        private readonly auditLogsService: AuditLogsService,
        @InjectRepository(UserEntity, DatabaseNames.CMMS_DB)
        private readonly userRepository: Repository<UserEntity>,
    ) { }

    async validateUserCredentials(username: string, password: string) {
        try {
            const user = await this.userRepository.findOne({
                where: [
                    { username: username },
                    { email: username },
                ],
                relations: ['supervisors']
            });

            if (!user) {
                throw new HttpException('User not found, please check the username', HttpStatus.BAD_REQUEST);
            }

            // Check if the user is marked as deleted
            if (user.isDeleted === true) {
                throw new HttpException('User not active, Please check with admin', HttpStatus.BAD_REQUEST);
            }
            // Compare provided password with the stored hashed password
            const isPasswordValid = await bcrypt.compare(password, user.password);

            // if (!isPasswordValid) {
            // throw new HttpException('Incorrect password. Please try again.', HttpStatus.BAD_REQUEST);
            // }

            return this.normalizeService.normalizeuser(user);
        } catch (error) {
            this.loggerService.loggerService({ level: LogsLevelConstant.ERROR, message: error?.message });
            throw new HttpException(error?.message, error?.status);
        }
    }

    async registerUser(createUserDto: CreateUserDto) {
        try {
            // Check if the username already exists in the database.
            const existingUser = await this.userRepository.findOne({
                where: [
                    { username: createUserDto.username },
                    { email: createUserDto.email }
                ]
            });

            if (existingUser) {
                const conflictField = existingUser.username === createUserDto.username
                    ? 'Username'
                    : 'Email';

                throw new HttpException(`${conflictField} already exists`, HttpStatus.BAD_REQUEST);
            }

            // Hash the password before saving it.
            const encryptPassword = await bcrypt.hash(createUserDto.password, 10);
            createUserDto.password = encryptPassword;

            // Save the user to the database.
            const newUser = await this.userRepository.save(createUserDto);

            // Associate supervisors
            if (createUserDto.supervisorIds && createUserDto.supervisorIds.length > 0) {
                const supervisors = await this.userRepository.find({
                    where: {
                        id: In(createUserDto.supervisorIds),
                    },
                });
                newUser.supervisors = supervisors;
                await this.userRepository.save(newUser);
            }
            return newUser;
        } catch (error) {
            this.loggerService.loggerService({ level: LogsLevelConstant.ERROR, message: error?.message });
            throw new HttpException(error?.message, error?.status);
        }
    }

    async create(createUserDto: CreateUserDto, request: Req) {
        try {
            const userId = request?.user?.id;
            // Check if the username already exists in the database.
            const existingUser = await this.userRepository.findOne({
                where: [
                    { username: createUserDto.username },
                    { email: createUserDto.email }
                ],
            });

            if (existingUser) {
                const conflictField = existingUser.username === createUserDto.username
                    ? 'Username'
                    : 'Email';

                throw new HttpException(`${conflictField} already exists`, HttpStatus.BAD_REQUEST);
            }

            // Hash the password before saving it.
            const encryptPassword = await bcrypt.hash(createUserDto.password, 10);
            createUserDto.password = encryptPassword;

            createUserDto[FIELDS_CONSTANTS.CREATED_BY] = userId;
            createUserDto[FIELDS_CONSTANTS.UPDATED_BY] = userId;

            // Save the user to the database.
            const newUser = await this.userRepository.save(createUserDto);

            // Associate supervisors
            if (createUserDto.supervisorIds && createUserDto.supervisorIds.length > 0) {
                const supervisors = await this.userRepository.find({
                    where: {
                        id: In(createUserDto.supervisorIds),
                    },
                });
                newUser.supervisors = supervisors;
                await this.userRepository.save(newUser);
            }

            this.auditLogsService.create(ActionTypeEnum.CREATE_USER, userId, createUserDto);

            return newUser;
        } catch (error) {
            this.loggerService.loggerService({ level: LogsLevelConstant.ERROR, message: error?.message });
            throw new HttpException(error?.message, error?.status);
        }
    }

    async findAllUsers(userFilters: UserFilters) {
        try {
            const { role, username, email, firstName, lastName, isDeleted, mobileNumber, offset = 0, limit = 10 } = userFilters;
            const queryBuilder = this.userRepository.createQueryBuilder('user')
                .leftJoinAndSelect('user.supervisors', 'supervisors')
                .leftJoinAndSelect('user.role', 'role')
                .leftJoinAndSelect('role.permissions', 'permission');

            // Apply filters using ILIKE for case-insensitive search
            if (username) {
                queryBuilder.andWhere('LOWER(user.username) ILIKE :username', { username: `%${username.toLowerCase()}%` });
            }

            if (firstName) {
                queryBuilder.andWhere('LOWER(user.firstName) ILIKE :firstName', { firstName: `%${firstName.toLowerCase()}%` });
            }

            if (lastName) {
                queryBuilder.andWhere('LOWER(user.lastName) ILIKE :lastName', { lastName: `%${lastName.toLowerCase()}%` });
            }

            if (mobileNumber) {
                queryBuilder.andWhere('user.mobileNumber = :mobileNumber', { mobileNumber });
            }

            if (role) {
                queryBuilder.andWhere('role.name = :role', { role });
            }

            if (email) {
                queryBuilder.andWhere('user.email = :email', { email });
            }

            if (isDeleted !== undefined) {
                queryBuilder.andWhere('user.isDeleted = :isDeleted', { isDeleted });
            }

            // Add pagination and sorting
            queryBuilder.skip(offset).take(limit).orderBy('user.createdAt', 'DESC');

            // Execute the query
            const [users, total] = await queryBuilder.getManyAndCount();

            // Normalize the data
            const normalizedUsers = await Promise.all(
                users.map((user) => this.normalizeService.normalizeuser(user)),
            );
            return {
                total,
                users: normalizedUsers
            };
        } catch (error) {
            this.loggerService.loggerService({ level: LogsLevelConstant.ERROR, message: error?.message });
            throw new HttpException(error?.message, error?.status);
        }
    }

    async update(updateUserDto: UpdateUserDto, id: string, request: Req) {
        try {
            const userId = request?.user?.id;

            const existingUser = await this.userRepository.findOne({
                where: { id },
                relations: ['supervisors']
            });
            if (!existingUser) {
                throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            }
            updateUserDto[FIELDS_CONSTANTS.CREATED_BY] = userId;
            updateUserDto[FIELDS_CONSTANTS.UPDATED_BY] = userId;
            // Update user fields
            const updatedUser = this.userRepository.merge(existingUser, updateUserDto);

            // Handle supervisors (if provided in the DTO)
            if (updateUserDto.supervisorIds) {
                const supervisors = await this.userRepository.findBy({
                    id: In(updateUserDto.supervisorIds),
                });

                if (supervisors.length !== updateUserDto.supervisorIds.length) {
                    throw new HttpException('Some supervisor IDs are invalid', HttpStatus.BAD_REQUEST);
                }

                updatedUser.supervisors = supervisors;
            }
            // Save the updated user
            await this.userRepository.save(updatedUser);
            this.auditLogsService.create(ActionTypeEnum.UPDATE_USER, userId, { userId: id, ...updateUserDto });

        } catch (error) {
            this.loggerService.loggerService({ level: LogsLevelConstant.ERROR, message: error?.message });
            throw new HttpException(error?.message, error?.status);
        }
    }

    async findActiveUserById(userId: string) {
        try {
            const user = await this.userRepository.findOne({
                where: {
                    id: userId,
                    isDeleted: false
                },
                relations: ['supervisors']
            });
            if (!user) {
                throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            }
            return this.normalizeService.normalizeuser(user);
        } catch (error) {
            this.loggerService.loggerService({ level: LogsLevelConstant.ERROR, message: error?.message });
            throw new HttpException(error?.message, error?.status);
        }
    }

    async softDeleteUser(id: string, request: Req) {
        try {
            const userId = request?.user?.id;
            // Retrieve the user
            const existingUser = await this.userRepository.findOne({
                where: { id },
            });

            if (!existingUser) {
                throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            }

            await this.userRepository.update({ id }, { isDeleted: true, deletedBy: userId });
            this.auditLogsService.create(ActionTypeEnum.DELETE_USER, userId, { userId: id, isDeleted: true, deletedBy: userId });

        } catch (error) {
            this.loggerService.loggerService({ level: LogsLevelConstant.ERROR, message: error?.message });
            throw new HttpException(error?.message, error?.status);
        }
    }

    async resetPasswordByUserId(resetPasswordDto: ResetPasswordDto, id: string, request: Req) {
        try {
            const userId = request?.user?.id;

            const existingUser = await this.userRepository.findOne({
                where: { id },
            });
            if (!existingUser) {
                throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            }

            // Hash the password before saving it.
            const encryptPassword = await bcrypt.hash(resetPasswordDto.password, 10);
            resetPasswordDto.password = encryptPassword;

            await this.userRepository.update({ id }, resetPasswordDto);

            this.auditLogsService.create(ActionTypeEnum.PASSWORD_RESET, userId, { userId: id, ...resetPasswordDto });

        } catch (error) {
            this.loggerService.loggerService({ level: LogsLevelConstant.ERROR, message: error?.message });
            throw new HttpException(error?.message, error?.status);
        }
    }

    async findUserById(userId: string) {
        try {
            const user = await this.userRepository.findOne({
                where: {
                    id: userId
                },
                relations: ['supervisors']
            });
            if (!user) {
                throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            }
            return this.normalizeService.normalizeuser(user);
        } catch (error) {
            this.loggerService.loggerService({ level: LogsLevelConstant.ERROR, message: error?.message });
            throw new HttpException(error?.message, error?.status);
        }
    }

    async getUsersBySupervisorId(supervisorId: string) {
        try {
            const userSupervisor = await this.userRepository.find({
                where: { supervisors: { id: supervisorId } },
            });

            return userSupervisor.map((user) => this.normalizeService.normalizeuser(user)) || [];
        } catch (error) {
            this.loggerService.loggerService({ level: LogsLevelConstant.ERROR, message: error?.message });
            throw new HttpException(error?.message, error?.status);
        }
    }

}
