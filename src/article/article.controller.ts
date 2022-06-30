import { ArticleResponseInterface } from './types/articleResponse.interface'
import { CreateArticleDto } from './dto/createArticle.dto'
import { UserEntity } from '@app/user/user.entity'
import { AuthGuard } from './../user/guards/auth.guard'
import { ArticleService } from './article.service'
import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { User } from '@app/user/decorators/user.decorator'

@Controller('articles')
export class ArticleController {
	constructor(private readonly ArticleService: ArticleService) {}
	@Post()
	@UseGuards(AuthGuard)
	async create(
		@User() currentUser: UserEntity,
		@Body('article') createArticleDto: CreateArticleDto
	): Promise<ArticleResponseInterface> {
		const article = await this.ArticleService.createArticle(
			currentUser,
			createArticleDto
		)
		return this.ArticleService.buildArticleResponse(article)
	}
}
