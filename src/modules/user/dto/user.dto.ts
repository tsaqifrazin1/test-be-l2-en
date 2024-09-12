import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString, IsStrongPassword } from 'class-validator';
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

  role?: RoleType = RoleType.USER;

  @ApiProperty({
    description: 'password',
  })
  @IsStrongPassword()
  password: string;
}
