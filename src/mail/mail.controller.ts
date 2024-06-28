import { Body, Controller, Post } from "@nestjs/common";
import { MailService } from "./mail.service";
import { SendAskDto } from "./dto/send-ask.dto";

@Controller("/api/mail")
export class MailController {
    constructor(private readonly mailService: MailService) {}

    @Post("ask")
    ask(@Body() sendAskDto: SendAskDto) {
        return this.mailService.sendMail(sendAskDto);
    }
}
