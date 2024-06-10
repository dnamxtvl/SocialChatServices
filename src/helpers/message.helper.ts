import path from "path";
import { TypeMessageEnum } from "src/const/enums/message/type"
export const addTypeMessageForFiles = (files: Express.Multer.File[]) => {
    let imagesPath = [];
    let videoPath = [];
    let allFilesAfterConvert = [];

    for (let file of files) {
        if (file.mimetype.includes('image')) {
            imagesPath.push(file.path);
        } else if (file.mimetype.includes('video')) {
            videoPath.push(file);
        } else {
            allFilesAfterConvert.push({
                path: file.path,
                type: file.mimetype.includes('audio') ? TypeMessageEnum.AUDIO : TypeMessageEnum.FILE
            })
        }
    }

    if (imagesPath.length > 0) {
        allFilesAfterConvert.push({
            type: imagesPath.length > 1 ? TypeMessageEnum.IMAGES : TypeMessageEnum.IMAGE,
            path: imagesPath
        })
    }

    if (videoPath.length > 0) {
        allFilesAfterConvert.push({
            type: videoPath.length > 1 ? TypeMessageEnum.VIDEOS : TypeMessageEnum.VIDEO,
            path: videoPath
        })
    }

    return allFilesAfterConvert;
}