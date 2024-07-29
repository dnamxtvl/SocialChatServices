export const APPLICATION_CONST = {
    API_CHECK_LOGIN: '/check-login',
    USER_API_HOST: 'http://user_service.local/api',
    PATH_UPLOAD_FILE: {
        CONVERSATION: 'conversation',
    },
    CONVERSATION: {
        LIMIT_PAGINATE: 15,
        FIRST_PAGE: 1,
        DEFAULT_SKIP: 0,
    },
    MESSAGE: {
        FIRST_PAGE: 1,
        TIME_FIRST_OF_AVG: 15 * 60 * 1000,
        LIMIT_PAGINATE: 50,
    },
    AWS_STREAM_CHUNK_SIZE:5242880,
    AWS_UPLOAD_QUEUE_SIZE:4
}