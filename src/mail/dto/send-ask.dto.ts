import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class SendAskDto {
    @IsString()
    @ApiProperty({ description: "문의 제목", default: "" })
    title: string;

    @IsString()
    @ApiProperty({ description: "문의 내용", default: "" })
    text: string;
}
