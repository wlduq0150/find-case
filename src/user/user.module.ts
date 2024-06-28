import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { JwtModule } from "@nestjs/jwt";
import { UserRepository } from "./user.repository";

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    exports: [UserService],
    controllers: [UserController],
    providers: [UserService, UserRepository],
})
export class UserModule {}
