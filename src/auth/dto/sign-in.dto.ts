import { PickType } from "@nestjs/swagger";
import { CreateUserDto } from "src/user/dto/create-user.dto";

export class SignInDto extends PickType(CreateUserDto, ["email", "password"]) {}
