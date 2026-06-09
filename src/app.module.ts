import { Global, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ControllerModule } from './controller/controller.module';
import { ServiceModule } from './service/service.module';
import { DatabaseDefaultModule } from './database/database.default.module';
import { DatabaseDynamicModule } from './database/database.dynamic.module';
import { ContextMiddleware } from './middleware/context-middleware';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { UtilsModule } from './utils/utils.module';


@Module({
  imports: [ControllerModule, DatabaseDefaultModule, DatabaseDynamicModule, ServiceModule, EventEmitterModule.forRoot({
    // 配置选项，例如启用通配符
    wildcard: false,
    delimiter: '.',
  }), UtilsModule],
  providers: [],
  exports: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ContextMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
