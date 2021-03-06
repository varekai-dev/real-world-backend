import { UpdateUserDto } from './dto/update-user.dto'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateUserDto } from './dto/create-user.dto'
import { UserEntity } from './user.entity'
import { sign } from 'jsonwebtoken'
import { JWT_SECRET } from '@app/config'
import { UserResponseInterface } from './types/userResponse.interface'
import { LoginDto } from './dto/login.dto'
import { compare } from 'bcrypt'
import { hash } from 'bcrypt'
@Injectable()
export class UserService {
	constructor(
		@InjectRepository(UserEntity)
		private readonly userRepository: Repository<UserEntity>
	) {}
	async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
		const errorResponse = {
			errors: {},
		}
		const userByEmail = await this.userRepository.findOne({
			email: createUserDto.email,
		})
		const userByUsername = await this.userRepository.findOne({
			username: createUserDto.username,
		})
		if (userByUsername) {
			errorResponse.errors['username'] = 'Username are taken'
			throw new HttpException(errorResponse, HttpStatus.UNPROCESSABLE_ENTITY)
		}
		if (userByEmail) {
			errorResponse.errors['email'] = 'Email are taken'
			throw new HttpException(errorResponse, HttpStatus.UNPROCESSABLE_ENTITY)
		}
		const newUser = new UserEntity()
		Object.assign(newUser, createUserDto)
		return await this.userRepository.save(newUser)
	}

	async login(loginDto: LoginDto) {
		const errorResponse = {
			errors: { 'email or password': 'is invalid' },
		}
		const user = await this.userRepository.findOne(
			{
				email: loginDto.email,
			},
			{ select: ['id', 'username', 'email', 'bio', 'image', 'password'] }
		)
		if (!user) {
			throw new HttpException(errorResponse, HttpStatus.UNAUTHORIZED)
		}
		const isPasswordValid = await compare(loginDto.password, user.password)
		if (!isPasswordValid) {
			throw new HttpException(
				'Invalid email or password',
				HttpStatus.UNAUTHORIZED
			)
		}
		delete user.password
		return user
	}
	async findById(id: number): Promise<UserEntity> {
		return await this.userRepository.findOne(id)
	}

	buildUserResponse(user: UserEntity): UserResponseInterface {
		return {
			user: {
				...user,
				token: this.generateJWT(user),
			},
		}
	}
	generateJWT(user: UserEntity): string {
		return sign(
			{
				id: user.id,
				username: user.username,
				email: user.email,
			},
			JWT_SECRET
		)
	}
	async updateUser(userId: number, dto: UpdateUserDto): Promise<UserEntity> {
		if (dto.password) {
			dto.password = await hash(dto.password, 10)
		}
		const user = await this.findById(userId)
		Object.assign(user, dto)
		const updatedUser = await this.userRepository.save(user)
		delete updatedUser.password
		return updatedUser
	}
}
