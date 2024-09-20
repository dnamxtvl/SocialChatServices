import { FileObject } from "src/@type/Message";
import { ApplicationError } from "../exceptions";
import { HttpStatus } from "@nestjs/common";
import { ExceptionCode } from "src/domain/chat/enums/exception-code";
import { VALIDATION } from "src/const/validation";
import { AuthUser } from "src/@type/User";

export class UploadFileCommand {
    constructor(
      public readonly user: AuthUser,
      public readonly files: Array<FileObject>,
      public readonly fileUUIds: Array<string>
    ) {
        this.validateFileLength();
        this.validateFilesSize();
        this.validateFileUUIdsLength();
    }

    private validateFileLength() {
        if (this.files.length === 0) {
            throw new ApplicationError(
                'Chưa có file nào được tải lên!',
                HttpStatus.BAD_REQUEST,
                ExceptionCode.FILES_IS_REQUIRED,
            )
        }

        if (this.files.length > VALIDATION.FILE_UPLOAD.MAX_COUNT) {
            throw new ApplicationError(
                'Số lượng tải lên không được vượt quá 20 file!',
                HttpStatus.BAD_REQUEST,
                ExceptionCode.FILES_LENGTH_IS_TOO_LONG
            )
        }
    }

    private validateFilesSize() {
        for (let file of this.files) {
            if (file.mimetype.includes('image')) {
                if (file.size > VALIDATION.IMAGE_UPLOAD.MAX_SIZE) {
                    throw new ApplicationError(
                        'Dung lượng ảnh không đượt vượt quá 10mb!',
                        HttpStatus.BAD_REQUEST,
                        ExceptionCode.IMAGE_IS_TOO_LARGE
                    )
                }
            } else {
                if (file.size > VALIDATION.FILE_UPLOAD.MAX_SIZE) {
                    throw new ApplicationError(
                        'File không được vượt quá 100mb!',
                        HttpStatus.BAD_REQUEST,
                        ExceptionCode.FILE_IS_TOO_LARGE
                    )
                }    
            }
        }
    }

    private validateFileUUIdsLength() {
        if (this.fileUUIds.length != this.files.length) {
            throw new ApplicationError(
                'Id file không hợp lệ!',
                HttpStatus.BAD_REQUEST,
                ExceptionCode.INVALID_FILE_ID
            )
        }
    }
}