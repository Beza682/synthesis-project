import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateCurrencies1741877073300 implements MigrationInterface {
    async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO "currencies" ("id", "name", "code", "version")
            VALUES
                ('1a91950a-aa43-4ef2-8dd7-b9333342adde', 'euro', 'EUR', 1),
                ('6a0b2b2c-71d9-4604-8109-58debd5e3dfc','рубль', 'RUB', 1),
                ('dc1da924-e777-47a5-9f06-e879dd52e1a7', 'dollar', 'USD', 1);
        `)
    }

    async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM "currencies"
            WHERE "id" IN (
                '1a91950a-aa43-4ef2-8dd7-b9333342adde',
                '6a0b2b2c-71d9-4604-8109-58debd5e3dfc',
                'dc1da924-e777-47a5-9f06-e879dd52e1a7'
            );
        `)
    }
}
