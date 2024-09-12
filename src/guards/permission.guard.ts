import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private readonly _reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const permissionDecorators = this._reflector.get<string[]>(
      'permissionType',
      context.getHandler(),
    );

    if (!permissionDecorators) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const {usertypeId, permissions} = request.user;
    if (usertypeId === 1) return true;

    let isValidAccess = false;
    permissionDecorators.forEach(val=>{
        isValidAccess = permissions.includes(val)
        if (isValidAccess) return
    })

    return isValidAccess;
  }
}
