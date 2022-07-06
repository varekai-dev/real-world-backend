import { ArticleResponseInterface } from './types/articleResponse.interface'
import { CreateArticleDto } from './dto/createArticle.dto'
import { UserEntity } from '@app/user/user.entity'
import { AuthGuard } from './../user/guards/auth.guard'
import { ArticleService } from './article.service'
import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
	Query,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'
import { User } from '@app/user/decorators/user.decorator'
import { UpdateArticleDto } from './dto/updateArticle.dto'
import { ArticlesResponseInterface } from './types/articlesResponseInterface'

@Controller('articles')
export class ArticleController {
	constructor(private readonly ArticleService: ArticleService) {}
	@Post()
	@UseGuards(AuthGuard)
	@UsePipes(new ValidationPipe())
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

	@Get()
	async findAll(
		@User('id') currentUserId: number,
		@Query() query: any
	): Promise<ArticlesResponseInterface> {
		return await this.ArticleService.findAll(currentUserId, query)
	}

	@Get(':slug')
	async getSingleArticle(
		@Param('slug') slug: string
	): Promise<ArticleResponseInterface> {
		const article = await this.ArticleService.findBySlug(slug)
		return this.ArticleService.buildArticleResponse(article)
	}

	@Delete(':slug')
	@UseGuards(AuthGuard)
	async deleteArticle(
		@Param('slug') slug: string,
		@User('id') currentUserId: number
	): Promise<string> {
		return await this.ArticleService.deleteArticle(slug, currentUserId)
	}

	@Put(':slug')
	@UseGuards(AuthGuard)
	@UsePipes(new ValidationPipe())
	async updateArticle(
		@Body('article') updateArticleDto: UpdateArticleDto,
		@Param('slug') slug: string,
		@User('id') currentUserId: number
	): Promise<ArticleResponseInterface> {
		const article = await this.ArticleService.updateArticle(
			slug,
			updateArticleDto,
			currentUserId
		)
		return this.ArticleService.buildArticleResponse(article)
	}
}
