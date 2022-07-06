import {MigrationInterface, QueryRunner} from "typeorm";

export class AddUniqueTitleToArticle1656702089364 implements MigrationInterface {
    name = 'AddUniqueTitleToArticle1656702089364'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "articles" ADD CONSTRAINT "UQ_3c28437db9b5137136e1f6d6096" UNIQUE ("title")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "articles" DROP CONSTRAINT "UQ_3c28437db9b5137136e1f6d6096"`);
    }

}
