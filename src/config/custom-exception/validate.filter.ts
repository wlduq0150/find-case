import { ExceptionFilter, Catch, ArgumentsHost, BadRequestException, HttpException } from "@nestjs/common";
import { Response } from "express";

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
    catch(exception: BadRequestException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = exception.getStatus();
        const exceptionResponse: any = exception.getResponse();

        if (typeof exceptionResponse.message === "object" && exceptionResponse.message instanceof Array) {
            const validationErrors = exceptionResponse.message;
            const formattedErrors = this.formatErrors(validationErrors);

            response.status(status).json({
                message: formattedErrors,
                error: "Bad Request",
                statusCode: 400,
            });
        } else {
            response.status(status).json(exceptionResponse);
        }
    }

    private formatErrors(errors: string[]) {
        const result = {};
        errors.forEach((error) => {
            console.log(error);
            const [errorProp, errorMessage] = error.split(":");
            if (error) {
                result[errorProp] = errorMessage;
            }
        });
        return result;
    }
}
