import { Controller } from "@nestjs/common";
import { HttpStatus } from "@nestjs/common";
import * as express from 'express'
import { logger } from "src/logs/nest.log";

@Controller()
export class BaseController {
    protected responseWithSuccess(res: express.Response, data: Object | null) {
        return res.status(HttpStatus.OK).json({
            data: data,
            message: 'Success!' 
        })
    }

    protected responseWithError(res: express.Response, error: any) {
        return res.status(error.status ?? HttpStatus.INTERNAL_SERVER_ERROR).json({
            errors: {
                code: error.response?.detailCode ?? 0,
            },
            message: error.message ?? error.errorResponse.errmsg
        })
    }
}