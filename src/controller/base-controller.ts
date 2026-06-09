import { Logger } from '@nestjs/common';
import { Request } from 'express';


/**
 * 控制器基类
 */
export class BaseController {

    /**
     * 返回成功数据
     */
    protected success({ data, msg, code }: { data: any; msg?: string; code: number }) {
        return {
            code: code || 200,
            msg: msg || '操作成功',
            data: data || null,
        };
    }
}
