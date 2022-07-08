import { UserEntity } from '@app/user/user.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Module } from '@nestjs/common'
import { ProfileController } from './profile.controller'
import { ProfileService } from './profile.service'

@Module({
	imports: [TypeOrmModule.forFeature([UserEntity])],
	controllers: [ProfileController],
	providers: [ProfileService],
})
export class ProfileModule {}
