import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { UserRepository } from "./user.repository";
import { ConfigService } from "@nestjs/config";
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "./entities/user.entity";
import * as bcrypt from "bcrypt";

@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly configService: ConfigService,
    ) {}

    // 유저 생성
    async createUser(createUserDto: CreateUserDto) {
        const { email } = createUserDto;

        const isExist = await this.userRepository.findOneBy({ email });
        if (isExist) {
            throw new ConflictException("이미 가입된 이메일입니다.");
        }

        return this.userRepository.save(createUserDto);
    }

    // 유저 조회(ID)
    async findUserById(userId: number) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });

        if (!userId || !user) {
            throw new NotFoundException("유저를 찾을 수 없습니다.");
        }

        return user;
    }

    // 유저 소셜 ID 조회
    private async findUserBySocialId(socialType: string, socialId: string) {
        const user = await this.userRepository.findOne({
            where: { [socialType]: socialId },
        });

        if (!socialId || !user) return null;

        return user;
    }

    // 유저 조회(Kakao ID)
    findUserByKakaoId(userId: string) {
        return this.findUserBySocialId("kakaoId", userId);
    }

    // 유저 조회(Google ID)
    findUserByGoogleId(userId: string) {
        return this.findUserBySocialId("googleId", userId);
    }

    // 유저 조회(Naver ID)
    findUserByNaverId(userId: string) {
        return this.findUserBySocialId("naverId", userId);
    }

    // 유저 인증
    async verifyUser(email: string, password: string) {
        const user = await this.userRepository.findOne({
            where: { email },
            select: ["id", "password", "role", "refreshToken"],
        });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new UnauthorizedException("유효한 아이디, 비밀번호가 아닙니다.");
        }

        return user;
    }

    // 유저 인증
    async verifyUserRefreshToken(userId: number, refreshToken: string) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            select: ["id", "password", "role", "refreshToken"],
        });

        if (!user || !(await bcrypt.compare(refreshToken, user.refreshToken))) {
            return null;
        }

        return user;
    }

    // 유저 리프레쉬 토큰 저장
    async updateRefreshToken(user: User, refreshToken: string) {
        const saltRounds = +this.configService.get("SALT_ROUNDS");
        user.refreshToken = await bcrypt.hash(refreshToken, saltRounds);
        return this.userRepository.save(user);
    }
}
