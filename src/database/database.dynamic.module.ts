// src/database/database.module.ts
import { Global, Module, Provider, Scope, Inject } from '@nestjs/common';
import { APP_GUARD, REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { DynamicConnectionService } from './dynamic-connection.service';
// import { DatabaseTouchInterceptor } from './database.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { EntityTarget, ObjectLiteral, Repository } from 'typeorm';
import { RequestContext } from 'src/utils/request-context';
import { DynamicInitConfigService } from './dynamic.init.config.service';

import { DbServiceModule } from 'src/service/db/db.service.module';
import { ServiceModule } from 'src/service/service.module';

/**
 * 动态 Repository 的工厂函数
 * @param entity - TypeORM 实体类
 * @returns 一个 NestJS 提供者
 */
export function createRepositoryProvider<T extends ObjectLiteral>(
  entity: EntityTarget<T>,
): Provider {
  return {
    provide: `DynamicRepository`, // 使用实体名称作为默认标识
    scope: Scope.REQUEST, // 每个请求单独实例化
    useFactory: async (
      connService: DynamicConnectionService,
      request: Request,
    ): Promise<Repository<T>> => {

      // 从请求头中获取数据库标识（根据你的业务逻辑调整）
      const dbName = RequestContext.getDbName(); // 默认数据库名称
      // console.log(`Creating repository for DB: ${dbName}`);
      // 获取 Repository
      return connService.getRepository(dbName, entity);
    },
    inject: [DynamicConnectionService, REQUEST],
  };
}


// APP_GUARD	注册全局守卫 (Guard)
// APP_INTERCEPTOR	注册全局拦截器 (Interceptor)
// APP_PIPE	注册全局管道 (Pipe)
// APP_FILTER	注册全局异常过滤器 (Exception Filter)

@Global()
@Module({
  imports: [ServiceModule],
  providers: [
    DynamicConnectionService,
    DynamicInitConfigService,
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: DatabaseTouchInterceptor,
    // },
  ],
  exports: [DynamicConnectionService],
})
export class DatabaseDynamicModule { }