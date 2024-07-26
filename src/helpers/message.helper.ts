import { FileObject } from "src/@type/Message";
import { TypeMessageEnum } from "src/const/enums/message/type"
export const getTypeMessageForFile = (fileMime: string) => {
    if (fileMime.includes('image')) {
        return TypeMessageEnum.IMAGE
    }
    if (fileMime.includes('video')) {
        return TypeMessageEnum.VIDEO
    }
    if (fileMime.includes('audio')) {
        return TypeMessageEnum.AUDIO
    }

    return TypeMessageEnum.FILE
}

export const sortedFiles = (files: FileObject[]) => {
    return files.sort((a, b) => {
        const isImageA = a.mimetype.startsWith('image/');
        const isImageB = b.mimetype.startsWith('image/');
        if (isImageA && !isImageB) {
          return -1;
        }
        if (!isImageA && isImageB) {
          return 1;
        }
        return 0;
    });
}