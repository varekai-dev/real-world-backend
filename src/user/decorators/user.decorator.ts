import { ExpressRequestInterface } from '@app/types/expressRequest.interface'
import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const User = createParamDecorator((data: any, ctx: ExecutionContext) => {
	const request = ctx.switchToHttp().getRequest<ExpressRequestInterface>()
	if (!request.user) {
		return null
	}
	return data ? request.user[data] : request.user
})
