import { UserEntity } from './user.entity'
import { ExpressRequestInterface } from '@app/types/expressRequest.interface'
import {
	Body,
	Controller,
	Get,
	Post,
	UsePipes,
	ValidationPipe,
	Req,
} from '@nestjs/common'
import { Request } from 'express'
import { User } from './decorators/user.decorator'
import { CreateUserDto } from './dto/create-user.dto'
import { LoginDto } from './dto/login.dto'
import { UserResponseInterface } from './types/userResponse.interface'
import { UserService } from './user.service'

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
	async currentUser(
		@Req() request: ExpressRequestInterface,
		@User() user: UserEntity
	): Promise<UserResponseInterface> {
		console.log('user', user)
		return this.userService.buildUserResponse(request.user)
	}
}
