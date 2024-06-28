import { BadRequestException, Injectable } from "@nestjs/common";
import * as AWS from "aws-sdk";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class UploadImageService {
    private s3: AWS.S3;
    constructor(private configService: ConfigService) {
        const isConnect = this.configService.get("AWS_ACCESS_KEY_ID");

        if (isConnect) {
            this.s3 = new AWS.S3({
                accessKeyId: this.configService.get("AWS_ACCESS_KEY_ID"),
                secretAccessKey: this.configService.get("AWS_SECRET_ACCESS_KEY"),
                region: this.configService.get("AWS_REGION"),
            });
        }
    }

    // 이미지 업로드
    async uploadFile(folder: string, file: Express.Multer.File, filename: string): Promise<string> {
        // 파일 null이면 예외처리
        if (!file) {
            throw new BadRequestException("파일을 찾을 수 없습니다.");
        }

        const { originalname, buffer } = file;
        const bucketName = this.configService.get("AWS_BUCKET_NAME");
        const key = `${folder}/${Date.now()}-${filename}`;

        // s3업로드
        try {
            const uploadResult = await this.s3
                .upload({
                    Bucket: bucketName,
                    Key: key,
                    Body: buffer,
                })
                .promise();

            if (!uploadResult.Location) {
                throw new Error();
            }

            return key;
        } catch (e) {
            throw new BadRequestException("이미지 업로드 실패");
        }
    }

    // 이미지 삭제
    deleteObjectFromS3(key: string) {
        const bucketName = this.configService.get("AWS_BUCKET_NAME");

        // 이미지 삭제
        this.s3.deleteObject(
            {
                Bucket: bucketName,
                Key: key,
            },
            function (err, data) {
                if (err) {
                    throw new BadRequestException("파일 삭제 실패");
                } else {
                    console.log("Success", data);
                }
            },
        );
    }

    // 임시 권한 이미지 url 반환
    getSignedUrl(key: string, expires: number = 900): string {
        if (!key) return null;

        return this.s3.getSignedUrl("getObject", {
            Bucket: this.configService.get("AWS_BUCKET_NAME"),
            Key: key,
            Expires: expires, // 유효 시간 (초 단위), 기본값은 15분
        });
    }
}
