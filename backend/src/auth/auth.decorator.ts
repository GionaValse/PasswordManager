import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtRequest } from './auth.types';

export const GetUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request: JwtRequest = ctx.switchToHttp().getRequest<JwtRequest>();
  return request.user;
});
