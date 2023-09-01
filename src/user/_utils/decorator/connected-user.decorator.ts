import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ConnectedUser = createParamDecorator((_data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToRpc().getContext();
  return request.user;
});
