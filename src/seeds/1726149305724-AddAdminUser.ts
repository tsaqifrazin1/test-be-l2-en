import { MigrationInterface, QueryRunner } from "typeorm"
import { UserEntity } from "src/modules/user/entitites"
import * as bcrypt from 'bcryptjs'
import { RoleType } from "src/common/type"

export class AddAdminUser1726149305724 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const email = process.env.ADMIN_EMAIL ?? 'admin.klontong@gmail.com'
        const password = process.env.ADMIN_PASSWORD
        const hash = await bcrypt.hash(password, 10);
        await queryRunner.connection
          .createQueryBuilder(UserEntity, 'user')
          .insert()
          .values({
            username: 'adminKlontong',
            email,
            password: hash,
            role: RoleType.ADMIN,
          })
          .execute();
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
