import { Injectable, CanActivate, ExecutionContext, ForbiddenException, HttpException, HttpStatus } from '@nestjs/common';
import { PermissionsEnum } from 'src/app/api/role-permissions/role.interface';

@Injectable()
export class PermissionGuard implements CanActivate {
    constructor(private readonly requiredPermission: PermissionsEnum) { }

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        
        if (!user || !user?.permissions) {
            throw new HttpException('Access denied: No permissions found.', HttpStatus.UNAUTHORIZED,);
        }

        if (!user?.permissions.includes(this.requiredPermission)) {
            throw new HttpException(
                `Access denied: Missing required permission ${this.requiredPermission}.`, HttpStatus.UNAUTHORIZED,
            );
        }

        return true;
    }
}
