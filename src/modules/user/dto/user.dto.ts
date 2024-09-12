import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString, ValidateIf } from 'class-validator';
import { RoleType } from 'src/common/type';

export class UserDto {
  @ApiProperty({
    description: 'username',
  })
  @IsString()
  username: string;

  @ApiProperty({
    description: 'email',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    type: 'enum',
    enum: RoleType,
    description: 'role type',
  })
  @IsEnum(RoleType)
  role?: RoleType;

  password: string;
}
