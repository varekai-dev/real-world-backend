import { MigrationInterface, QueryRunner } from 'typeorm'

export class SeedDb1656023216305 implements MigrationInterface {
	name = 'SeedDb1656023216305'

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`INSERT INTO tags (name) VALUES ('dragons'),('coffee'), ('nestjs')`
		)
		// password is 123456
		await queryRunner.query(
			`INSERT INTO users (username, email, password) VALUES('foo','foo@gmail.com', '$2b$10$D0Hy3/pr35tN6O4mdLmJI.u3oLuP2WCCmRV.3qZTypbsr.YowLbpa')`
		)
		await queryRunner.query(
			`INSERT INTO articles (slug, title, description, body, "tagList", "authorId") VALUES ('first-article','First article', 'first article desc','first article body', 'coffee,dragons','1' )`
		)
		await queryRunner.query(
			`INSERT INTO articles (slug, title, description, body, "tagList", "authorId") VALUES ('second-article','Second article', 'Second article desc','Second article body', 'coffee,dragons', '1' )`
		)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {}
}
