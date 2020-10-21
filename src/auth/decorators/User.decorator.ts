import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { User as UserEntity } from "../user/user.entity";

export const AuthUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): UserEntity => {
      const request = ctx.switchToHttp().getRequest();
      return request.user;
    },
  );