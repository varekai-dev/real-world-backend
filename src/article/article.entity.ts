import { UserEntity } from '@app/user/user.entity'
import {
	BeforeUpdate,
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'

@Entity({ name: 'articles' })
export class ArticleEntity {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	slug: string

	@Column()
	title: string

	@Column({ default: '' })
	description: string

	@Column({ default: '' })
	body: string

	@Column('simple-array')
	tagList: string[]

	@Column({ default: 0 })
	favoritesCount: number

	@CreateDateColumn()
	createdAt: Date

	@UpdateDateColumn()
	updatedAt: Date

	@ManyToOne(() => UserEntity, (user) => user.articles)
	author: UserEntity
}
