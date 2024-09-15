import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTableAuditLogs1726372712726 implements MigrationInterface {
    name = 'AddTableAuditLogs1726372712726'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "audit_logs" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "entity" character varying NOT NULL, "entity_id" integer NOT NULL, "operation" character varying NOT NULL, "old_data" jsonb NOT NULL, "new_data" jsonb, "performed_by" character varying NOT NULL, CONSTRAINT "PK_1bb179d048bbc581caa3b013439" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "audit_logs"`);
    }

}
