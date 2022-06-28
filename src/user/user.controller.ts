import { Body, Controller, Post } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UserEntity } from './user.entity'
import { UserService } from './user.service'

@Controller()
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post('users')
	async createUser(
		@Body('user') createUserDto: CreateUserDto
	): Promise<UserEntity> {
		const user = await this.userService.createUser(createUserDto)
		return this.userService.buildUserResponse(user)
	}
}