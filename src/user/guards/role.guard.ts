import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserService } from "../user.service";
import { Request } from "express";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private readonly userService: UserService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        // 요구 권한 확인
        const role = this.reflector.get("role", context.getHandler());
        if (!role) {
            return true;
        }

        // 사용자 불러오기
        const req = context.switchToHttp().getRequest<Request>();
        const userId = req.params?.userId ? +req.params?.userId : -1;
        const user = await this.userService.findUserById(userId);

        // 권환 일치여부 확인
        if (user.role < role) {
            return false;
        }

        return true;
    }
}
