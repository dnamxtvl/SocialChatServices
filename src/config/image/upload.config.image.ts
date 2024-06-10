import { BadRequestException } from '@nestjs/common';
import { Request } from 'express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { VALIDATION } from 'src/const/validation';
import { logger } from 'src/logs/nest.log';

export const imageUploadOptions = (path: string) => ({
  storage: diskStorage({
    destination: './public/files/' + path,
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = extname(file.originalname);
      const filename = `${uniqueSuffix}${ext}`;
      callback(null, filename);
    },
  }),
  limits: {
    fileSize: VALIDATION.FILE_UPLOAD.MAX_SIZE
  }
});
