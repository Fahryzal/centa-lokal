import { CanActivate, ExecutionContext, Injectable, UseGuards } from '@nestjs/common';
import { CustomRequest } from '@shared/types/custom-request';
import { Observable } from 'rxjs';

function CreateModuleName(moduleName: string) {
	@Injectable()
	class ModuleNameGuard implements CanActivate {
		canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
			const req = context.switchToHttp().getRequest() as CustomRequest;
			req.moduleName = moduleName;
			return true;
		}
	}
	return new ModuleNameGuard();
}

export const SetModuleName = (moduleName: string) => UseGuards(CreateModuleName(moduleName));
