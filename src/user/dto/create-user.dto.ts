import { IsNotEmpty, IsString, IsEmail } from 'class-validator'

export class CreateUserDto {
	@IsNotEmpty()
	@IsString()
	readonly username: string

	@IsNotEmpty()
	@IsString()
	readonly password: string

	@IsNotEmpty()
	@IsEmail()
	readonly email: string
}
