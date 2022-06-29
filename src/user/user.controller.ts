import { UserEntity } from './user.entity'
import {
	Body,
	Controller,
	Get,
	Post,
	UsePipes,
	ValidationPipe,
	UseGuards,
	Put,
} from '@nestjs/common'
import { User } from './decorators/user.decorator'
import { CreateUserDto } from './dto/create-user.dto'
import { LoginDto } from './dto/login.dto'
import { UserResponseInterface } from './types/userResponse.interface'
import { UserService } from './user.service'
import { AuthGuard } from './guards/auth.guard'
import { UpdateUserDto } from './dto/update-user.dto'

@Controller()
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post('users')
	@UsePipes(new ValidationPipe())
	async createUser(
		@Body('user') createUserDto: CreateUserDto
	): Promise<UserResponseInterface> {
		const user = await this.userService.createUser(createUserDto)
		return this.userService.buildUserResponse(user)
	}

	@Post('users/login')
	@UsePipes(new ValidationPipe())
	async loginUser(
		@Body('user') loginDto: LoginDto
	): Promise<UserResponseInterface> {
		const user = await this.userService.login(loginDto)
		return this.userService.buildUserResponse(user)
	}

	@Get('user')
	@UseGuards(AuthGuard)
	async currentUser(@User() user: UserEntity): Promise<UserResponseInterface> {
		return this.userService.buildUserResponse(user)
	}

	@Put('user')
	@UseGuards(AuthGuard)
	async updateCurrentUser(
		@User('id') currentUserId: number,
		@Body('user') dto: UpdateUserDto
	): Promise<UserResponseInterface> {
		const user = await this.userService.updateUser(currentUserId, dto)
		return this.userService.buildUserResponse(user)
	}
}
