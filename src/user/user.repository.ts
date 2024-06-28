import { Injectable } from "@nestjs/common";
import { Brackets, DataSource, Repository, SelectQueryBuilder } from "typeorm";
import { User } from "./entities/user.entity";

@Injectable()
export class UserRepository extends Repository<User> {
    constructor(private readonly dataSource: DataSource) {
        super(User, dataSource.createEntityManager());
    }
}
