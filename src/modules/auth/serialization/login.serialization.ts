import { ApiProperty } from "@nestjs/swagger";
import { UserGetSerialization } from "src/modules/user/serializations/user.serialization";

export class LoginSerialization extends UserGetSerialization {
  @ApiProperty()
  token: string;
}