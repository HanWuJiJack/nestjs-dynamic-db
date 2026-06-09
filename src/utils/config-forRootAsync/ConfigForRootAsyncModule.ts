import { DynamicModule, Module } from "@nestjs/common";
import { ConfigForRootService } from "./ConfigForRootService";




// 参数	类型	核心用途	代码示例
// imports	数组	确保NestJS在加载数据库配置前，注入其他必需的模块	imports: [ConfigModule]
// useFactory	工厂函数	一个可以注入依赖并异步执行的工厂函数，用于动态创建配置对象。这是最常用的配置模式	useFactory: (configService: ConfigService) => ({...})
// inject	数组	声明useFactory函数所需要的依赖项列表，这些依赖项会按顺序作为参数传入	inject: [ConfigService]
// useClass	类	指定一个自定义类来提供配置，这个类必须实现TypeOrmOptionsFactory接口	useClass: ConfigService
// useExisting	令牌	复用应用中已存在的实现了TypeOrmOptionsFactory接口的服务，避免重复实例化	useExisting: ConfigService
// name	字符串	为多数据源的场景指定数据库连接名称。如果省略，默认为 'default'	name: 'user-connection'
// dataSourceFactory	工厂函数	一个允许你完全控制TypeORM DataSource实例创建的工厂函数	dataSourceFactory: async (options) => { const dataSource = new DataSource(options); ... }
// extraProviders	数组	高级功能：用于注册仅在当前模块内可用的额外自定义提供者，简化模块封装	extraProviders: [/* 自定义服务 */]

@Module({})
export class ConfigForRootAsyncModule {
    static forRootAsync(data): DynamicModule {
        return {
            module: ConfigForRootAsyncModule,
            imports: data.imports || [],
            providers: [
                // {
                //     provide: ConfigForRootService,
                //     useValue: new ConfigForRootService(data.useFactory,data.inject),
                // },
            ],
            exports: [
                // ConfigForRootService,
            ],
        };
    }
}