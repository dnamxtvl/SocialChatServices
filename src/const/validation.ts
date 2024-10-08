import { MAX_LENGTH } from "class-validator";

export const VALIDATION = {
    EMAIL_FORMAT: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    PHONE_FORMAT: /^[0-9-]{12,13}$|^[0-9-]{12}$/,
    ZIP_CODE: /^[0-9]{3}-?[0-9]{4}$/,
    VALID_TIME: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/g,
    ERROR_CODE: {
        VALIDATE_FAILED: 422
    },
    OTP: {
        MIN_VALUE: 100000,
        MAX_VALUE: 999999
    },
    EMAIL: {
        MIN_LENGTH: 8,
        MAX_LENGTH: 255
    },
    PASSWORD: {
        MIN_LENGTH: 8,
        MAX_LENGTH: 50
    },
    GENDER: {
        MALE: 0,
        FEMALE: 1,
        OTHER: 2
    },
    FIRST_NAME: {
        MIN_LENGTH: 1,
        MAX_LENGTH: 30
    },
    LAST_NAME: {
        MIN_LENGTH: 1,
        MAX_LENGTH: 30
    },
    DAY_OF_BIRTH: {
        MIN: 1,
        MAX: 31
    },
    MONTH_OF_BIRTH: {
        MIN: 1,
        MAX: 12
    },
    YEAR_OF_BIRTH: {
        MIN: 1900,
        MAX: 2023
    },
    ABOUNT_ME: {
        MAX_LENGTH: 255
    },
    MESSAGE: {
        ID_LENGTH: 24,
        CONTENT: {
            MAX_LENGTH: 20000
        }
    },
    CONVERSATION: {
        NAME: {
            MAX_LENGTH: 255
        },
        MAX_COUNT_USER: 1000,
        ID_LENGTH: 24,
        MIN_MEMBER: 2
    },
    USER: {
        ID_LENGTH: 36
    },
    IMAGE_UPLOAD: {
        MAX_SIZE: 10 * 1024 * 1024,
        FILE_TYPE: /(image\/jpeg|image\/png|image\/jpg|image\/webp)$/
    },
    FILE_UPLOAD: {
        MAX_COUNT: 20,
        MAX_SIZE: 100 * 1024 * 1024,
        FILE_TYPE: /jpeg|jpg|png|gif|mp4|mp3|webm|avi|webp|mkv|pdf|docx|mp3|zip|xlsx|txt|csv|rar|7z|tar|gz|sql|pptx|txt/,
    },
    TYPE_MESSAGE: {
        TEXT: 0,
        IMAGE: 1,
        FILE: 2
    }
};

