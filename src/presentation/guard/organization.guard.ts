import {
    CanActivate,
    ExecutionContext,
    Injectable,
  } from '@nestjs/common';
import { logger } from 'src/logs/nest.log';
import { TypeAccountEnum } from 'src/const/enums/user/type-account';
  
  @Injectable()
  export class OrganiztionGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      let isPermission = request.user.type_account === TypeAccountEnum.ORGANIZATION

      if (!isPermission) {
        logger.error('Permission denied at Organization guard');
        return false;
      }

      return true;
    }
  }