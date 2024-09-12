import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { RoleType } from 'src/common/type';

export class UserGetSerialization {
  @ApiProperty({
    description: 'id',
    example: faker.number.int({ min: 1, max: 999 }),
  })
  id: number;

  @ApiProperty({
    description: 'username',
    example: faker.internet.userName(),
  })
  username: string;

  @ApiProperty({
    description: 'email',
    example: faker.internet.email(),
  })
  email: string;

  @ApiProperty({
    type: 'enum',
    enum: RoleType,
    description: 'role type',
  })
  role: RoleType;

  @ApiProperty({
    example: faker.date.recent(),
  })
  createdAt: Date;

  @ApiProperty({
    example: faker.date.recent(),
  })
  updatedAt: Date;

  @Exclude()
  deletedAt: Date;

  @Exclude()
  readonly password: string;
}