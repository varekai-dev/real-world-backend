import { UpdateArticleDto } from './dto/updateArticle.dto'
import { ArticleResponseInterface } from './types/articleResponse.interface'
import { UserEntity } from '@app/user/user.entity'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { getRepository, Repository } from 'typeorm'
import { ArticleEntity } from './article.entity'
import { CreateArticleDto } from './dto/createArticle.dto'
import slugify from 'slugify'
import { ArticlesResponseInterface } from './types/articlesResponseInterface'

@Injectable()
export class ArticleService {
	constructor(
		@InjectRepository(ArticleEntity)
		private readonly articleRepository: Repository<ArticleEntity>,
		@InjectRepository(UserEntity)
		private readonly userRepository: Repository<UserEntity>
	) {}

	async findAll(
		currentUserId: number,
		query: any
	): Promise<ArticlesResponseInterface> {
		const queryBuilder = getRepository(ArticleEntity)
			.createQueryBuilder('articles')
			.leftJoinAndSelect('articles.author', 'author')

		queryBuilder.orderBy('articles.createdAt', 'DESC')

		if (query.tag) {
			queryBuilder.andWhere('articles.tagList LIKE :tag', {
				tag: `%${query.tag}%`,
			})
		}

		if (query.author) {
			const author = await this.userRepository.findOne({
				username: query.author,
			})
			if (!author)
				throw new HttpException(
					'Such author does not exist',
					HttpStatus.NOT_FOUND
				)
			queryBuilder.andWhere('articles.authorId =:id', {
				id: author.id,
			})
		}

		if (query.limit) {
			queryBuilder.limit(query.limit)
		}

		if (query.offset) {
			queryBuilder.offset(query.offset)
		}
		const articlesCount = await queryBuilder.getCount()
		const articles = await queryBuilder.getMany()

		return {
			articles,
			articlesCount,
		}
	}

	async createArticle(
		currentUser: UserEntity,
		dto: CreateArticleDto
	): Promise<ArticleEntity> {
		const findArticleTitle = await this.articleRepository.findOne({
			title: dto.title,
		})
		if (findArticleTitle) {
			throw new HttpException(
				'Article with such title already exists',
				HttpStatus.NOT_ACCEPTABLE
			)
		}
		const article = new ArticleEntity()
		Object.assign(article, dto)
		if (!article.tagList) {
			article.tagList = []
		}
		article.slug = slugify(article.title, { lower: true })
		article.author = currentUser
		return await this.articleRepository.save(article)
	}

	buildArticleResponse(article: ArticleEntity): ArticleResponseInterface {
		return { article }
	}

	async findBySlug(slug: string): Promise<ArticleEntity> {
		const article = await this.articleRepository.findOne({ slug })
		if (!article) {
			throw new HttpException('Article not found', HttpStatus.NOT_FOUND)
		}

		return article
	}

	async deleteArticle(slug: string, currentUserId: number): Promise<string> {
		const article = await this.findBySlug(slug)
		if (!article) {
			throw new HttpException('Article not found', HttpStatus.NOT_FOUND)
		}

		if (article.author.id !== currentUserId) {
			throw new HttpException(
				'You are not allowed to delete this article',
				HttpStatus.FORBIDDEN
			)
		}
		await this.articleRepository.remove(article)
		return 'Article deleted'
	}

	async updateArticle(
		slug: string,
		updateArticleDto: UpdateArticleDto,
		currentUserId: number
	): Promise<ArticleEntity> {
		const article = await this.findBySlug(slug)
		if (!article) {
			throw new HttpException('Article not found', HttpStatus.NOT_FOUND)
		}
		if (article.author.id !== currentUserId) {
			throw new HttpException(
				'You are not allowed to update this article',
				HttpStatus.FORBIDDEN
			)
		}
		if (updateArticleDto.title !== article.title) {
			const findArticleTitle = await this.articleRepository.findOne({
				title: updateArticleDto.title,
			})
			if (findArticleTitle) {
				throw new HttpException(
					'Article with such title already exists',
					HttpStatus.NOT_ACCEPTABLE
				)
			}
		}
		article.slug = slugify(article.title, { lower: true })
		Object.assign(article, updateArticleDto)

		return await this.articleRepository.save(article)
	}
}
