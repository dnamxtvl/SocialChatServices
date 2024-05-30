import { BadRequestException } from '@nestjs/common';
import { Request } from 'express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { logger } from 'src/logs/nest.log';

export const imageUploadOptions = (path: string) => ({
  storage: diskStorage({
    destination: './public/images/' + path, // Đường dẫn thư mục lưu trữ
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = extname(file.originalname);
      const filename = `${uniqueSuffix}${ext}`;
      callback(null, filename);
    },
  }),
  limits: {
    fileSize: 1024 * 1024 * 10, // 10MB
  },
  fileFilter: (req: Request, file: any, callback: any) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      logger.error('File ' + file.originalname +  ' type not allowed');
      callback(new BadRequestException('File type not allowed'), false);
    }
  },
});
