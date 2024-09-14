import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTableProducts1726315098697 implements MigrationInterface {
    name = 'AddTableProducts1726315098697'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "products" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "sku" character varying NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "weight" integer NOT NULL, "width" integer NOT NULL, "length" integer NOT NULL, "height" integer NOT NULL, "image" character varying, "price" integer NOT NULL, "stock" integer NOT NULL, "category_id" integer NOT NULL, CONSTRAINT "UQ_c44ac33a05b144dd0d9ddcf9327" UNIQUE ("sku"), CONSTRAINT "UQ_4c9fb58de893725258746385e16" UNIQUE ("name"), CONSTRAINT "CHK_d064358889508d02cc4c7acdce" CHECK ("price" > 0), CONSTRAINT "CHK_aea3ee263e1d44e36e5f5b5783" CHECK ("stock" >= 0), CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_9a5f6868c96e0069e699f33e124" FOREIGN KEY ("category_id") REFERENCES "product_categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_9a5f6868c96e0069e699f33e124"`);
        await queryRunner.query(`DROP TABLE "products"`);
    }

}
