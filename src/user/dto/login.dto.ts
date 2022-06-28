import { IsNotEmpty, IsString, IsEmail } from 'class-validator'

export class LoginDto {
	@IsNotEmpty()
	@IsString()
	readonly password: string

	@IsNotEmpty()
	@IsEmail()
	readonly email: string
}
