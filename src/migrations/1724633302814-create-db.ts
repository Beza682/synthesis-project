import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateDb1724633302814 implements MigrationInterface {
    name = 'CreateDb1724633302814'

    async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "currencies" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "version" integer NOT NULL,
                "name" character varying NOT NULL,
                "code" character varying NOT NULL,
                CONSTRAINT "PK_d528c54860c4182db13548e08c4" PRIMARY KEY ("id")
            )
        `)
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "version" integer NOT NULL,
                "login" character varying NOT NULL,
                "password" character varying NOT NULL,
                "balance" numeric NOT NULL,
                "currency_id" uuid NOT NULL,
                CONSTRAINT "UQ_2d443082eccd5198f95f2a36e2c" UNIQUE ("login"),
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
            )
        `)
        await queryRunner.query(`
            CREATE TABLE "transactions" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "version" integer NOT NULL,
                "amount" numeric NOT NULL,
                "from" uuid NOT NULL,
                "to" uuid NOT NULL,
                CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY ("id")
            )
        `)
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD CONSTRAINT "FK_4fce05fbaa74e7e255fa0f33b10" FOREIGN KEY ("currency_id") REFERENCES "currencies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `)
        await queryRunner.query(`
            ALTER TABLE "transactions"
            ADD CONSTRAINT "FK_0697b5941a6016ab531b156049e" FOREIGN KEY ("from") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `)
        await queryRunner.query(`
            ALTER TABLE "transactions"
            ADD CONSTRAINT "FK_8f7e03be67a425cce6663b36255" FOREIGN KEY ("to") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `)
    }

    async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "transactions" DROP CONSTRAINT "FK_8f7e03be67a425cce6663b36255"
        `)
        await queryRunner.query(`
            ALTER TABLE "transactions" DROP CONSTRAINT "FK_0697b5941a6016ab531b156049e"
        `)
        await queryRunner.query(`
            ALTER TABLE "users" DROP CONSTRAINT "FK_4fce05fbaa74e7e255fa0f33b10"
        `)
        await queryRunner.query(`
            DROP TABLE "transactions"
        `)
        await queryRunner.query(`
            DROP TABLE "users"
        `)
        await queryRunner.query(`
            DROP TABLE "currencies"
        `)
    }
}
