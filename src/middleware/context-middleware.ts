import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction } from "express";
import { RequestContext } from "src/utils/request-context";

@Injectable()
export class ContextMiddleware implements NestMiddleware {

    use(req: Request, res: Response, next: NextFunction) {

        const store = new Map();

        Math.random() > 0.5 ? store.set('dbName', "db1") : store.set('dbName', "db2");

        // store.set('dbName', "db2");
        RequestContext.storage.run(store, () => {
            // console.log(`Request...`);
            next();
        });
    }
}


// export function ContextMiddleware(req: Request, res: Response, next: NextFunction) {
//     console.log(`Request...`);
//     const store = new Map();
//     RequestContext.storage.run(store, () => {
//         next();
//     });
// };