import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import app from './config/app';
import { AuthMiddleware } from './auth/auth.middleware';
import { AuthModule } from './auth/auth.module';
import { RedisCacheModule } from './redis-cache/redis-cache.module';
import { ScheduleModule } from '@nestjs/schedule';
import { UsersModule } from './app/api/users/user.module';
import { DatabaseModule } from './database/database.module';
import { RouteConstants } from './app/api/constants/route-constants';
import { RoleModule } from './app/api/role-permissions/role.module';
import { AssetModule } from './app/api/asset/asset.module';
import { TaskModule } from './app/api/task/task.module';
import { AuditLogsModule } from './app/api/audit-logs/audit-logs.module';
import { ChecklistModule } from './app/api/checklist/checklist.module';
import { NotificationsModule } from './app/api/notifications/notifications.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    load: [app],
    envFilePath: '.env'
  }),
  ScheduleModule.forRoot(),
    AuthModule,
    RedisCacheModule,
    UsersModule,
    DatabaseModule,
    AssetModule,
    RoleModule,
    TaskModule,
    AuditLogsModule,
    ChecklistModule,
    NotificationsModule
  ],
  controllers: [],
  providers: [
    ConfigService
  ],
  exports: []
})

export class AppModule implements NestModule {
  constructor() {
    console.error('🚀 🚀 🚀 APP MODULE INITIALIZING... 🚀 🚀 🚀');
  }
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: RouteConstants.API_LOGIN, method: RequestMethod.POST },
        { path: RouteConstants.API_REGISTER_USER, method: RequestMethod.POST },
      )
      .forRoutes('*');
  }
}