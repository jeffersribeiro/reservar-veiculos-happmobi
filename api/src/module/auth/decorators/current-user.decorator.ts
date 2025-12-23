import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export type CurrentUserShape = {
  id: string;
  email?: string;
  roles?: string[];
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): CurrentUserShape | undefined => {
    const req = ctx.switchToHttp().getRequest<{ user?: CurrentUserShape }>();
    return req.user;
  },
);
