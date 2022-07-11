import { FollowEntity } from './../profile/follow.entity'
import { UserEntity } from './../user/user.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Module } from '@nestjs/common'
import { ArticleController } from './article.controller'
import { ArticleService } from './article.service'
import { ArticleEntity } from './article.entity'

@Module({
	imports: [
		TypeOrmModule.forFeature([ArticleEntity, UserEntity, FollowEntity]),
	],
	controllers: [ArticleController],
	providers: [ArticleService],
})
export class ArticleModule {}
