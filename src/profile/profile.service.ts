import { UserEntity } from '@app/user/user.entity'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { FollowEntity } from './follow.entity'
import { ProfileType } from './types/profile.type'
import { ProfileResponseInterface } from './types/profileResponse.interface'

@Injectable()
export class ProfileService {
	constructor(
		@InjectRepository(UserEntity)
		private readonly userRepository: Repository<UserEntity>,
		@InjectRepository(FollowEntity)
		private readonly followRepository: Repository<FollowEntity>
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

		const follow = await this.followRepository.findOne({
			followerId: currentUserId,
			followingId: user.id,
		})

		return {
			...user,
			following: Boolean(follow),
		}
	}

	async buildProfileResponse(profile): Promise<ProfileResponseInterface> {
		delete profile.email
		return { profile }
	}

	async followProfile(
		currentUserId: number,
		profileUsername: string
	): Promise<ProfileType> {
		const user = await this.userRepository.findOne({
			username: profileUsername,
		})
		if (!user) {
			throw new HttpException('User not found', HttpStatus.NOT_FOUND)
		}

		if (currentUserId === user.id) {
			throw new HttpException(
				'Follower and following user must not be the same',
				HttpStatus.BAD_REQUEST
			)
		}

		const follow = await this.followRepository.findOne({
			followerId: currentUserId,
			followingId: user.id,
		})
		if (!follow) {
			const followToCreate = new FollowEntity()
			followToCreate.followerId = currentUserId
			followToCreate.followingId = user.id
			await this.followRepository.save(followToCreate)
		}
		return {
			...user,
			following: true,
		}
	}
	async unfollowProfile(
		currentUserId: number,
		profileUsername: string
	): Promise<ProfileType> {
		const user = await this.userRepository.findOne({
			username: profileUsername,
		})
		if (!user) {
			throw new HttpException('User not found', HttpStatus.NOT_FOUND)
		}

		if (currentUserId === user.id) {
			throw new HttpException(
				'Follower and following user must not be the same',
				HttpStatus.BAD_REQUEST
			)
		}

		await this.followRepository.delete({
			followerId: currentUserId,
			followingId: user.id,
		})

		return {
			...user,
			following: false,
		}
	}
}
