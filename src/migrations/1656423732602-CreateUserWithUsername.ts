import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateUserWithUsername1656423732602 implements MigrationInterface {
    name = 'CreateUserWithUsername1656423732602'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "username" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "username"`);
    }

}
