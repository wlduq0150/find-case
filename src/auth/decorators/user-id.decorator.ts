import { ExecutionContext, createParamDecorator } from "@nestjs/common";

export const UserId = createParamDecorator((data: unknown, ctx: ExecutionContext): number => {
    const req = ctx.switchToHttp().getRequest();
    const user = req.user;

    if (user && user.id) {
        return user.id;
    }

    return null;
});
