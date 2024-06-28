import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { UserService } from "./user.service";

@Controller("/api/user")
export class UserController {
    constructor(private readonly userService: UserService) {}
}
