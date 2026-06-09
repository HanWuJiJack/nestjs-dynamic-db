// import {
//   CallHandler,
//   ExecutionContext,
//   Injectable,
//   NestInterceptor,
// } from '@nestjs/common';
// import { Observable } from 'rxjs';
// import { tap, catchError } from 'rxjs/operators';
// import { DynamicConnectionService } from './dynamic-connection.service';
// import { RequestContext } from 'src/utils/request-context';

// @Injectable()
// export class DatabaseTouchInterceptor implements NestInterceptor {
//   constructor(private readonly connectionService: DynamicConnectionService) { }

//   intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
//     const request = context.switchToHttp().getRequest();
//     // 假设从请求头获取数据库标识（例如 x-tenant-id）
//     const dbName = "db1";
//     RequestContext.storage
//       .getStore()
//       ?.set('dbName', dbName);
//     return next.handle();
//   }
// }