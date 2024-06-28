import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
    IsEmail,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    Matches,
    Max,
    MaxLength,
    Min,
    MinLength,
} from "class-validator";
import { ValidationMessage } from "src/config/validate/messages/message.class";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm";

@Entity({ name: "users" })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @IsOptional()
    @IsString({ message: ValidationMessage.string("kakaoId") })
    @Column({ nullable: true, name: "kakao_id" })
    kakaoId?: string;

    @IsOptional()
    @IsString({ message: ValidationMessage.string("googleId") })
    @Column({ nullable: true, name: "google_id" })
    googleId?: string;

    @IsOptional()
    @IsString({ message: ValidationMessage.string("naverId") })
    @Column({ nullable: true, name: "naver_id" })
    naverId?: string;

    @ApiProperty({ description: "유저명", default: "김땡땡" })
    @IsNotEmpty({ message: ValidationMessage.required("name") })
    @IsString({ message: ValidationMessage.string("name") })
    @MaxLength(50, { message: ValidationMessage.maxLength("name", 50) })
    @MinLength(1, { message: ValidationMessage.minLength("name", 1) })
    @Column()
    name: string;

    @ApiProperty({ description: "이메일", default: "test@email.com" })
    @IsNotEmpty({ message: ValidationMessage.required("email") })
    @IsEmail({}, { message: ValidationMessage.email("email") })
    @MaxLength(50, { message: ValidationMessage.maxLength("email", 50) })
    @Column({ unique: true })
    email: string;

    @ApiProperty({ description: "비밀번호", default: "password@@" })
    @IsString({ message: ValidationMessage.string("password") })
    @Matches(ValidationMessage.passwordRegex(), { message: ValidationMessage.passwordMessage("password") })
    @Column({ nullable: true, select: false })
    password?: string;

    @Column({ nullable: true, select: false })
    refreshToken?: string;

    @ApiPropertyOptional({ description: "전화번호", default: "010-1234-5678" })
    @IsOptional()
    @IsString({ message: ValidationMessage.string("contact") })
    @Matches(ValidationMessage.contactRegex(), { message: ValidationMessage.contactMessage("contact") })
    @Column({ name: "contact", nullable: true, select: false })
    contact?: string;

    @ApiPropertyOptional({ description: "주민등록번호", default: "020131-******" })
    @IsOptional()
    @IsString({ message: ValidationMessage.string("regidentNumber") })
    @Matches(ValidationMessage.regidentNumberRegex(), {
        message: ValidationMessage.regidentNumberMessage("regidentNumber"),
    })
    @Column({ name: "regident_number", nullable: true, select: false })
    regidentNumber?: string;

    @ApiProperty({ description: "권한", default: 1 })
    @IsNotEmpty({ message: ValidationMessage.required("role") })
    @Max(4, { message: ValidationMessage.maxNumber("role", 4) })
    @Min(1, { message: ValidationMessage.minNumber("role", 1) })
    @IsNumber({}, { message: ValidationMessage.number("role") })
    @Column({ type: "tinyint", default: 1 })
    role: number;

    @ApiProperty({ description: "마케팅 수신 동의 여부", default: 0 })
    @IsNotEmpty({ message: ValidationMessage.required("agreeToMarketing") })
    @IsNumber({}, { message: ValidationMessage.number("agreeToMarketing") })
    @Column({ name: "agree_to_marketing", type: "tinyint", default: 0 })
    agreeToMarketing: number;

    @CreateDateColumn({ name: "created_at", select: false })
    createAt: Date;

    @UpdateDateColumn({ name: "updated_at", select: false })
    updatedAt: Date;

    @DeleteDateColumn({ name: "deleted_at", select: false })
    deletedAt: Date;
}
