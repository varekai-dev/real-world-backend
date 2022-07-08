import { UserEntity } from '@app/user/user.entity'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ProfileType } from './types/profile.type'
import { ProfileResponseInterface } from './types/profileResponse.interface'

@Injectable()
export class ProfileService {
	constructor(
		@InjectRepository(UserEntity)
		private readonly userRepository: Repository<UserEntity>
	) {}

	async getProfile(
		currentUserId: number,
		profileUsername: string
	): Promise<ProfileType> {
		const user = await this.userRepository.findOne({
			username: profileUsername,
		})
		if (!user) {
			throw new HttpException('User not found', HttpStatus.NOT_FOUND)
		}
		return {
			...user,
			following: false,
		}
	}

	async buildProfileResponse(profile): Promise<ProfileResponseInterface> {
		delete profile.email
		return { profile }
	}
}
