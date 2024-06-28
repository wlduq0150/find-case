import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { ValidationMessage } from "src/config/validate/messages/message.class";
import { Match } from "src/config/validate/decorators/match.decorator";
import { CreateUserDto } from "src/user/dto/create-user.dto";

export class SignUpDto extends CreateUserDto {
    @IsString({ message: ValidationMessage.string("checkPassword") })
    @Match("password", { message: ValidationMessage.checkPasswordMessage("checkPassword") })
    @ApiProperty({ description: "비밀번호 확인", default: "password@@" })
    checkPassword: string;
}
